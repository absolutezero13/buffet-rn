import axios from "axios";

const TWELVE_DATA_API_KEY = "80e10fa0a0104fc3a4ec0ed6737734e2";
const TWELVE_DATA_BASE = "https://api.twelvedata.com";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";
const COINGECKO_API_KEY = "CG-u6N8ZTM5Xg4HjkXCcDuVN2wt";
const SWISSQUOTE_BASE = "https://forex-data-feed.swissquote.com";

const twelveDataClient = axios.create({
  baseURL: TWELVE_DATA_BASE,
  params: { apikey: TWELVE_DATA_API_KEY },
});

const coingeckoClient = axios.create({
  baseURL: COINGECKO_BASE,
  headers: {
    "x-cg-demo-api-key": COINGECKO_API_KEY,
    "Accept-Encoding": "identity",
  },
});

// Twelve Data Response Interfaces
export interface TwelveDataQuote {
  symbol: string;
  name: string;
  exchange: string;
  mic_code: string;
  currency: string;
  datetime: string;
  timestamp: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  previous_close: string;
  change: string;
  percent_change: string;
  average_volume: string;
  is_market_open: boolean;
  fifty_two_week: {
    low: string;
    high: string;
    low_change: string;
    high_change: string;
    low_change_percent: string;
    high_change_percent: string;
    range: string;
  };
}

export interface TwelveDataTimeSeries {
  meta: {
    symbol: string;
    interval: string;
    currency: string;
    exchange_timezone: string;
    exchange: string;
    mic_code: string;
    type: string;
  };
  values: Array<{
    datetime: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
  }>;
  status: string;
}

export interface TwelveDataPrice {
  price: string;
}

export type AssetType = "stock" | "etf" | "crypto" | "gold" | "other";
interface SwissquoteBboQuote {
  spreadProfilePrices: Array<{
    spreadProfile: string;
    bid?: number;
    ask?: number;
  }>;
  ts: number;
}
export interface TwelveDataStockSearch {
  data: Array<{
    symbol: string;
    instrument_name: string;
    exchange: string;
    mic_code: string;
    exchange_timezone: string;
    instrument_type: string;
    country: string;
    currency: string;
    access: {
      global: string;
      plan: string;
    };
  }>;
}

// Legacy interface for backward compatibility
export interface StockQuote {
  c: number; // Current price (close)
  d: number; // Change
  dp: number; // Percent change
  h: number; // High
  l: number; // Low
  o: number; // Open
  pc: number; // Previous close
  t: number; // Timestamp
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  timestamp: number;
}

export const api = {
  // Get real-time stock quote using Twelve Data
  getStockQuote: async (symbol: string): Promise<StockQuote | null> => {
    try {
      const response = await twelveDataClient.get<TwelveDataQuote>("/quote", {
        params: { symbol: symbol.toUpperCase() },
      });

      const data = response.data;

      // Convert Twelve Data response to legacy StockQuote format
      return {
        c: parseFloat(data.close),
        d: parseFloat(data.change),
        dp: parseFloat(data.percent_change),
        h: parseFloat(data.high),
        l: parseFloat(data.low),
        o: parseFloat(data.open),
        pc: parseFloat(data.previous_close),
        t: data.timestamp,
      };
    } catch (error) {
      console.error("Error fetching stock quote from Twelve Data:", error);
      return null;
    }
  },

  // Get real-time price only (lighter endpoint)
  getStockPrice: async (symbol: string): Promise<number | null> => {
    try {
      const response = await twelveDataClient.get<TwelveDataPrice>("/price", {
        params: { symbol: symbol.toUpperCase() },
      });
      return parseFloat(response.data.price);
    } catch (error) {
      console.error("Error fetching stock price from Twelve Data:", error);
      return null;
    }
  },

  getPriceByAssetType: async (
    assetType: AssetType,
    identifier: string,
  ): Promise<number | null> => {
    switch (assetType) {
      case "stock":
      case "etf":
        return api.getStockPrice(identifier);
      case "crypto":
        const price = await api.getCryptoPrice([identifier]);
        return price;
      case "gold":
        return api.getCommodityPrice(identifier);
      default:
        return null;
    }
  },
  // Get full quote details from Twelve Data
  getStockQuoteFull: async (
    symbol: string,
  ): Promise<TwelveDataQuote | null> => {
    try {
      const response = await twelveDataClient.get<TwelveDataQuote>("/quote", {
        params: { symbol: symbol.toUpperCase() },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching full stock quote from Twelve Data:", error);
      return null;
    }
  },

  getCryptoPrice: async (ids: string[]): Promise<number | null> => {
    try {
      // const response = await coingeckoClient.get<CryptoPrice>("/simple/price", {
      //   params: {
      //     ids: ids.join(","),
      //     vs_currencies: "usd",
      //     include_24hr_change: true,
      //   },
      // });

      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&market_data=true`,
        {
          headers: {
            "x-cg-demo-api-key": COINGECKO_API_KEY,
            "Accept-Encoding": "identity",
          },
        },
      );
      const data = await response.json();

      const price = data.market_data.current_price.usd;

      return price;
    } catch (error) {
      console.error("Error fetching crypto price:", error);
      return null;
    }
  },

  getGoldPrice: async (): Promise<number | null> => {
    return api.getCommodityPrice("XAU");
  },

  getCommodityPrice: async (symbol: string): Promise<number | null> => {
    try {
      const instrument = symbol.toUpperCase();
      const response = await axios.get<SwissquoteBboQuote[]>(
        `${SWISSQUOTE_BASE}/public-quotes/bboquotes/instrument/${instrument}/USD`,
      );

      const quotes = response.data;
      if (!Array.isArray(quotes) || quotes.length === 0) {
        return null;
      }

      const quoteWithSpreads =
        quotes.find((quote) => quote.spreadProfilePrices?.length) || quotes[0];
      const spreads = quoteWithSpreads?.spreadProfilePrices || [];
      if (spreads.length === 0) return null;

      const preferredOrder = ["prime", "standard", "premium", "elite"];
      const preferred = spreads.find((spread) =>
        preferredOrder.includes(spread.spreadProfile),
      );
      const selected = preferred || spreads[0];

      const bid = selected.bid;
      const ask = selected.ask;
      if (typeof bid === "number" && typeof ask === "number") {
        return (bid + ask) / 2;
      }
      console.log("Commodity price fetched:", { bid, ask });
      return typeof bid === "number"
        ? bid
        : typeof ask === "number"
          ? ask
          : null;
    } catch (error) {
      console.error("Error fetching commodity price:", error);
      return null;
    }
  },

  // Get historical prices for crypto from CoinGecko
  getCryptoHistory: async (
    coinId: string,
    days: number,
  ): Promise<PriceHistoryPoint[]> => {
    try {
      const response = await coingeckoClient.get(
        `/coins/${coinId}/market_chart`,
        {
          params: {
            vs_currency: "usd",
            days: days,
          },
        },
      );

      console.log("Crypto history response:", response.data);

      const prices = response.data?.prices || [];
      return prices.map(([timestamp, price]: [number, number]) => ({
        timestamp,
        price,
        date: new Date(timestamp).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }));
    } catch (error) {
      console.error("Error fetching crypto history:", error);
      return [];
    }
  },

  // Get historical prices for stocks from Twelve Data (time series)
  getStockHistory: async (
    symbol: string,
    days: number,
  ): Promise<PriceHistoryPoint[]> => {
    try {
      // Determine interval based on days requested
      let interval = "1day";
      let outputsize = days;

      if (days <= 1) {
        interval = "1h";
        outputsize = 24;
      } else if (days <= 7) {
        interval = "1day";
        outputsize = days;
      } else if (days <= 30) {
        interval = "1day";
        outputsize = days;
      } else if (days <= 90) {
        interval = "1day";
        outputsize = days;
      } else {
        interval = "1week";
        outputsize = Math.ceil(days / 7);
      }

      const response = await twelveDataClient.get<TwelveDataTimeSeries>(
        "/time_series",
        {
          params: {
            symbol: symbol.toUpperCase(),
            interval,
            outputsize: Math.min(outputsize, 5000), // API limit
            order: "ASC",
          },
        },
      );

      const data = response.data;
      if (data.status !== "ok" || !data.values) {
        return [];
      }

      return data.values.map((item) => {
        const timestamp = new Date(item.datetime).getTime();
        return {
          timestamp,
          price: parseFloat(item.close),
          date: new Date(timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        };
      });
    } catch (error) {
      console.error("Error fetching stock history from Twelve Data:", error);
      return [];
    }
  },

  // Get time series with OHLCV data
  getStockTimeSeries: async (
    symbol: string,
    interval:
      | "1min"
      | "5min"
      | "15min"
      | "30min"
      | "45min"
      | "1h"
      | "2h"
      | "4h"
      | "1day"
      | "1week"
      | "1month" = "1day",
    outputsize: number = 30,
  ): Promise<TwelveDataTimeSeries | null> => {
    try {
      const response = await twelveDataClient.get<TwelveDataTimeSeries>(
        "/time_series",
        {
          params: {
            symbol: symbol.toUpperCase(),
            interval,
            outputsize: Math.min(outputsize, 5000),
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching time series from Twelve Data:", error);
      return null;
    }
  },

  searchSymbol: async (
    query: string,
  ): Promise<{ symbol: string; description: string }[]> => {
    try {
      // Use Twelve Data stocks endpoint with filter
      const response = await twelveDataClient.get<TwelveDataStockSearch>(
        "/symbol_search",
        {
          params: {
            symbol: query.toUpperCase(),
          },
        },
      );

      const stocks = response.data?.data || [];
      return stocks.slice(0, 10).map((stock) => ({
        symbol: stock.symbol,
        description: `${stock.instrument_name} (${stock.exchange})`,
      }));
    } catch (error) {
      console.error("Error searching symbol from Twelve Data:", error);
      return [];
    }
  },

  searchCrypto: async (
    query: string,
  ): Promise<{ id: string; symbol: string; name: string }[]> => {
    try {
      const response = await coingeckoClient.get("/search", {
        params: { query },
      });
      return response.data?.coins?.slice(0, 10) || [];
    } catch (error) {
      console.error("Error searching crypto:", error);
      return [];
    }
  },

  // Get multiple stock quotes at once (batch request)
  getMultipleStockQuotes: async (
    symbols: string[],
  ): Promise<Map<string, StockQuote>> => {
    const results = new Map<string, StockQuote>();

    try {
      // Twelve Data supports batch requests with comma-separated symbols
      const response = await twelveDataClient.get("/quote", {
        params: { symbol: symbols.map((s) => s.toUpperCase()).join(",") },
      });

      const data = response.data;

      // Handle single symbol response
      if (data.symbol) {
        const quote: StockQuote = {
          c: parseFloat(data.close),
          d: parseFloat(data.change),
          dp: parseFloat(data.percent_change),
          h: parseFloat(data.high),
          l: parseFloat(data.low),
          o: parseFloat(data.open),
          pc: parseFloat(data.previous_close),
          t: data.timestamp,
        };
        results.set(data.symbol, quote);
      } else {
        // Handle multiple symbols response
        for (const symbol of Object.keys(data)) {
          const item = data[symbol];
          if (item && item.close) {
            const quote: StockQuote = {
              c: parseFloat(item.close),
              d: parseFloat(item.change),
              dp: parseFloat(item.percent_change),
              h: parseFloat(item.high),
              l: parseFloat(item.low),
              o: parseFloat(item.open),
              pc: parseFloat(item.previous_close),
              t: item.timestamp,
            };
            results.set(symbol, quote);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching multiple stock quotes:", error);
    }

    return results;
  },

  // Get End of Day (EOD) price
  getStockEOD: async (
    symbol: string,
  ): Promise<{
    symbol: string;
    exchange: string;
    currency: string;
    datetime: string;
    close: number;
  } | null> => {
    try {
      const response = await twelveDataClient.get("/eod", {
        params: { symbol: symbol.toUpperCase() },
      });

      const data = response.data;
      return {
        symbol: data.symbol,
        exchange: data.exchange,
        currency: data.currency,
        datetime: data.datetime,
        close: parseFloat(data.close),
      };
    } catch (error) {
      console.error("Error fetching EOD price from Twelve Data:", error);
      return null;
    }
  },
};

// Export the Twelve Data client for advanced use cases
export { twelveDataClient };

// Type for interval options
export type TwelveDataInterval =
  | "1min"
  | "5min"
  | "15min"
  | "30min"
  | "45min"
  | "1h"
  | "2h"
  | "4h"
  | "1day"
  | "1week"
  | "1month";
