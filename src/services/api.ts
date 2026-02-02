import axios from "axios";
import { CurrencyCode } from "../navigation/constants";
import {
  ExchangeRateResponse,
  StockQuote,
  TwelveDataPrice,
  TwelveDataQuote,
  AssetType,
  PriceHistoryPoint,
  TwelveDataStockSearch,
  TwelveDataTimeSeries,
  SwissquoteBboQuote,
} from "./types";

const TWELVE_DATA_API_KEY = "80e10fa0a0104fc3a4ec0ed6737734e2";
const COINGECKO_API_KEY = "CG-u6N8ZTM5Xg4HjkXCcDuVN2wt";

const TWELVE_DATA_BASE = "https://api.twelvedata.com";
const COINGECKO_BASE = "https://api.coingecko.com/api/v3";
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

class Api {
  constructor() {}

  getCurrencyRate = async (
    from: CurrencyCode,
    to: CurrencyCode,
  ): Promise<number | null> => {
    try {
      if (from === to) {
        return 1;
      }

      const response = await twelveDataClient.get<ExchangeRateResponse>(
        "/exchange_rate",
        {
          params: { symbol: `${from}/${to}` },
        },
      );
      console.log("Currency conversion response:", response.data);

      const rate = response.data?.rate;
      return rate;
    } catch (error) {
      console.error("Error converting currency:", error);
      return null;
    }
  };
  getStockPrice = async (symbol: string): Promise<number | null> => {
    try {
      const response = await twelveDataClient.get<TwelveDataPrice>("/price", {
        params: { symbol: symbol.toUpperCase() },
      });

      console.log("Stock price response:", response.data);
      const price = parseFloat(response.data.price);

      return price;
    } catch (error) {
      console.error("Error fetching stock price from Twelve Data:", error);
      return null;
    }
  };

  getPriceByAssetType = async (
    assetType: AssetType,
    identifier: string,
    baseCurrency: CurrencyCode = "USD",
  ): Promise<number | null> => {
    console.log("Fetching price for:", {
      assetType,
      identifier,
      baseCurrency,
    });
    switch (assetType) {
      case "stock":
      case "etf":
        return this.getStockPrice(identifier);
      case "crypto":
        return api.getCryptoPrice(identifier, baseCurrency);
      case "gold":
        return api.getCommodityPrice(identifier);
      case "cash":
        return 0;
      default:
        return null;
    }
  };

  getStockQuoteFull = async (
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
  };

  getCryptoPrice = async (
    coinId: string,
    baseCurrency: CurrencyCode = "USD",
  ): Promise<number | null> => {
    try {
      const response = await coingeckoClient.get("/simple/price", {
        params: {
          ids: coinId,
          vs_currencies: baseCurrency.toLowerCase(),
          include_24hr_change: true,
        },
      });

      const price = response.data?.[coinId]?.[baseCurrency.toLowerCase()];
      return typeof price === "number" ? price : null;
    } catch (error) {
      console.error("Error fetching crypto price:", error);
      return null;
    }
  };

  getCommodityPrice = async (symbol: string): Promise<number | null> => {
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
        const mid = (bid + ask) / 2;
        return mid;
      }
      console.log("Commodity price fetched:", { bid, ask });
      const raw =
        typeof bid === "number" ? bid : typeof ask === "number" ? ask : null;
      if (raw === null) return null;
      return raw;
    } catch (error) {
      console.error("Error fetching commodity price:", error);
      return null;
    }
  };

  getCryptoHistory = async (
    coinId: string,
    days: number,
    baseCurrency: CurrencyCode = "USD",
  ): Promise<PriceHistoryPoint[]> => {
    try {
      const response = await coingeckoClient.get(
        `/coins/${coinId}/market_chart`,
        {
          params: {
            vs_currency: baseCurrency.toLowerCase(),
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
  };

  getStockHistory = async (
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
        const rawPrice = parseFloat(item.close);
        return {
          timestamp,
          price: rawPrice,
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
  };

  searchSymbol = async (
    query: string,
  ): Promise<{ symbol: string; description: string }[]> => {
    try {
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
  };

  searchCrypto = async (
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
  };

  getMultipleStockQuotes = async (
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
  };
}

export { twelveDataClient };
export const api = new Api();
