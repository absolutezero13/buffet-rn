import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CurrencyCode, STORAGE_KEYS } from "../navigation/constants";
import {
  StockQuote,
  AssetType,
  PriceHistoryPoint,
  SwissquoteBboQuote,
  YahooFinanceChartResponse,
  AlpacaBar,
  AlpacaBarsResponse,
  AlpacaLatestBarsResponse,
  AlpacaAsset,
  CoinGeckoCoin,
} from "./types";

const ALPACA_API_KEY = "PK7RQA5AOQBRNX5KOJUZMF2JCH";
const ALPACA_SECRET_KEY = "GFJmUTRiSnJeREsPy5XNRc1S3jT1qF3gCrVptHCif9SL";
const COINGECKO_API_KEY = "CG-u6N8ZTM5Xg4HjkXCcDuVN2wt";

const ALPACA_DATA_BASE = "https://data.alpaca.markets";
const ALPACA_PAPER_API_BASE = "https://paper-api.alpaca.markets";
const COINGECKO_BASE = "https://api.coingecko.com/api/v3";
const SWISSQUOTE_BASE = "https://forex-data-feed.swissquote.com";
const YAHOO_FINANCE_BASE = "https://query1.finance.yahoo.com/v8/finance";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const alpacaDataClient = axios.create({
  baseURL: ALPACA_DATA_BASE,
  headers: {
    "APCA-API-KEY-ID": ALPACA_API_KEY,
    "APCA-API-SECRET-KEY": ALPACA_SECRET_KEY,
  },
});

const alpacaPaperClient = axios.create({
  baseURL: ALPACA_PAPER_API_BASE,
  headers: {
    "APCA-API-KEY-ID": ALPACA_API_KEY,
    "APCA-API-SECRET-KEY": ALPACA_SECRET_KEY,
  },
});

const coingeckoClient = axios.create({
  baseURL: COINGECKO_BASE,
  headers: {
    "x-cg-demo-api-key": COINGECKO_API_KEY,
    "Accept-Encoding": "identity",
  },
});

class Api {
  private cachedAssets: { data: AlpacaAsset[]; timestamp: number } | null =
    null;
  private cachedCoins: { data: CoinGeckoCoin[]; timestamp: number } | null =
    null;

  constructor() {}

  getCurrencyRate = async (
    from: CurrencyCode,
    to: CurrencyCode,
  ): Promise<number | null> => {
    try {
      if (from === to) {
        return 1;
      }

      // Use Yahoo Finance for currency conversion (Alpaca doesn't support forex)
      const symbol = `${from}${to}=X`;
      const response = await axios.get<YahooFinanceChartResponse>(
        `${YAHOO_FINANCE_BASE}/chart/${symbol}`,
        {
          params: {
            interval: "1d",
            range: "1d",
          },
        },
      );
      console.log("Currency conversion response:", response.data);

      const result = response.data?.chart?.result?.[0];
      if (result?.meta?.regularMarketPrice) {
        return result.meta.regularMarketPrice;
      }
      return null;
    } catch (error) {
      console.error("Error converting currency:", error);
      return null;
    }
  };

  getStockPrice = async (symbol: string): Promise<number | null> => {
    try {
      const response = await alpacaDataClient.get<AlpacaLatestBarsResponse>(
        "/v2/stocks/bars/latest",
        {
          params: {
            symbols: symbol.toUpperCase(),
            feed: "iex",
          },
        },
      );

      console.log("Stock price response:", response.data);
      const bar = response.data.bars?.[symbol.toUpperCase()];
      const price = bar?.c; // c = close price

      return price && price > 0 ? price : null;
    } catch (error) {
      console.error("Error fetching stock price from Alpaca:", error);
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

  getStockQuoteFull = async (symbol: string): Promise<AlpacaBar | null> => {
    try {
      const response = await alpacaDataClient.get<AlpacaLatestBarsResponse>(
        "/v2/stocks/bars/latest",
        {
          params: {
            symbols: symbol.toUpperCase(),
            feed: "iex",
          },
        },
      );
      return response.data.bars?.[symbol.toUpperCase()] || null;
    } catch (error) {
      console.error("Error fetching full stock quote from Alpaca:", error);
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

  getCommodityHistory = async (
    symbol: string,
    days: number,
  ): Promise<PriceHistoryPoint[]> => {
    try {
      // Map days to Yahoo Finance range parameter
      let range = "1mo";
      if (days <= 7) {
        range = "5d";
      } else if (days <= 30) {
        range = "1mo";
      } else if (days <= 90) {
        range = "3mo";
      } else if (days <= 365) {
        range = "1y";
      } else {
        range = "5y";
      }

      // Determine interval based on range
      let interval = "1d";
      if (days <= 1) {
        interval = "1h";
      } else if (days <= 7) {
        interval = "1d";
      }

      const response = await axios.get<YahooFinanceChartResponse>(
        `${YAHOO_FINANCE_BASE}/chart/${symbol}`,
        {
          params: {
            interval,
            range,
          },
        },
      );

      const result = response.data?.chart?.result?.[0];
      if (!result || response.data?.chart?.error) {
        console.error("Yahoo Finance error:", response.data?.chart?.error);
        return [];
      }

      const timestamps = result.timestamp || [];
      const closes = result.indicators?.quote?.[0]?.close || [];

      const history: PriceHistoryPoint[] = [];
      for (let i = 0; i < timestamps.length; i++) {
        const timestamp = timestamps[i] * 1000; // Convert to milliseconds
        const price = closes[i];

        // Skip null/undefined prices
        if (price == null) continue;

        history.push({
          timestamp,
          price,
          date: new Date(timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        });
      }

      return history;
    } catch (error) {
      console.error(
        "Error fetching commodity history from Yahoo Finance:",
        error,
      );
      return [];
    }
  };

  getStockHistory = async (
    symbol: string,
    days: number,
  ): Promise<PriceHistoryPoint[]> => {
    try {
      // Calculate start and end dates
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - days);

      // Determine timeframe based on days requested
      let timeframe = "1Day";
      if (days <= 1) {
        timeframe = "1Hour";
      } else if (days > 365) {
        timeframe = "1Week";
      }

      const response = await alpacaDataClient.get<AlpacaBarsResponse>(
        "/v2/stocks/bars",
        {
          params: {
            symbols: symbol.toUpperCase(),
            timeframe,
            start: start.toISOString(),
            end: end.toISOString(),
            feed: "iex",
            adjustment: "raw",
            sort: "asc",
          },
        },
      );
      console.log("Stock history response:", response.data);

      const bars = response.data.bars?.[symbol.toUpperCase()] || [];
      if (!bars.length) {
        return [];
      }

      return bars.map((bar) => {
        const timestamp = new Date(bar.t).getTime();
        return {
          timestamp,
          price: bar.c,
          date: new Date(timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        };
      });
    } catch (error) {
      console.error("Error fetching stock history from Alpaca:", error);
      return [];
    }
  };

  // Cache for assets in memory (after loading from storage)

  private fetchAndCacheAssets = async (): Promise<AlpacaAsset[]> => {
    try {
      console.log("Fetching assets from Alpaca...");
      const response = await alpacaPaperClient.get<AlpacaAsset[]>(
        "/v2/assets",
        {
          params: {
            status: "active",
            asset_class: "us_equity",
          },
        },
      );

      const assets = response.data;
      console.log(`Fetched ${assets.length} assets from Alpaca`);

      const cacheData = { data: assets, timestamp: Date.now() };

      await AsyncStorage.setItem(
        STORAGE_KEYS.ALPACA_ASSETS,
        JSON.stringify(cacheData),
      );

      this.cachedAssets = cacheData;
      return assets;
    } catch (error) {
      console.error("Error fetching assets from Alpaca:", error);
      return [];
    }
  };

  getAlpacaAssets = async (): Promise<AlpacaAsset[]> => {
    const now = Date.now();

    // Return from memory cache if available and fresh
    if (this.cachedAssets && now - this.cachedAssets.timestamp < ONE_DAY_MS) {
      return this.cachedAssets.data;
    }

    // Try to load from storage
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.ALPACA_ASSETS);
      if (stored) {
        const cacheData = JSON.parse(stored) as {
          data: AlpacaAsset[];
          timestamp: number;
        };
        if (now - cacheData.timestamp < ONE_DAY_MS) {
          this.cachedAssets = cacheData;
          console.log(`Loaded ${cacheData.data.length} assets from storage`);
          return cacheData.data;
        }
      }
    } catch (error) {
      console.error("Error loading assets from storage:", error);
    }

    // Fetch from API
    return this.fetchAndCacheAssets();
  };

  searchSymbol = async (
    query: string,
  ): Promise<{ symbol: string; description: string }[]> => {
    try {
      const assets = await this.getAlpacaAssets();

      const queryUpper = query.toUpperCase();
      const filtered = assets
        .filter(
          (asset) =>
            asset.tradable &&
            (asset.symbol.includes(queryUpper) ||
              asset.name.toUpperCase().includes(queryUpper)),
        )
        .slice(0, 10);

      return filtered.map((asset) => ({
        symbol: asset.symbol,
        description: `${asset.name} (${asset.exchange})`,
      }));
    } catch (error) {
      console.error("Error searching symbol from Alpaca:", error);
      return [];
    }
  };

  searchCrypto = async (
    query: string,
  ): Promise<{ id: string; symbol: string; name: string }[]> => {
    try {
      const coins = await this.getCoinGeckoCoins();
      console.log(`searchCrypto coins "${coins}"`);

      const queryLower = query.toLowerCase();

      const startsWithFiltered = coins.filter(
        (coin) =>
          coin.name.toLowerCase().startsWith(queryLower) ||
          coin.symbol.toLowerCase().startsWith(queryLower),
      );

      const generalFiltered = coins
        .filter(
          (coin) =>
            coin.symbol.toLowerCase().includes(queryLower) ||
            coin.name.toLowerCase().includes(queryLower),
        )
        .slice(0, 10);

      return [...startsWithFiltered, ...generalFiltered].slice(0, 10);
    } catch (error) {
      console.error("Error searching crypto:", error);
      return [];
    }
  };

  private fetchAndCacheCoins = async (): Promise<CoinGeckoCoin[]> => {
    try {
      console.log("Fetching coins from CoinGecko...");
      const response =
        await coingeckoClient.get<CoinGeckoCoin[]>("/coins/list");

      const coins = response.data;
      console.log(`Fetched ${coins.length} coins from CoinGecko`);

      const cacheData = { data: coins, timestamp: Date.now() };

      await AsyncStorage.setItem(
        STORAGE_KEYS.COINGECKO_COINS,
        JSON.stringify(cacheData),
      );

      this.cachedCoins = cacheData;
      return coins;
    } catch (error) {
      console.error("Error fetching coins from CoinGecko:", error);
      return [];
    }
  };

  getCoinGeckoCoins = async (): Promise<CoinGeckoCoin[]> => {
    const now = Date.now();

    // Return from memory cache if available and fresh
    if (this.cachedCoins && now - this.cachedCoins.timestamp < ONE_DAY_MS) {
      return this.cachedCoins.data;
    }

    // Try to load from storage
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.COINGECKO_COINS);
      if (stored) {
        const cacheData = JSON.parse(stored) as {
          data: CoinGeckoCoin[];
          timestamp: number;
        };
        if (now - cacheData.timestamp < ONE_DAY_MS) {
          this.cachedCoins = cacheData;
          console.log(`Loaded ${cacheData.data.length} coins from storage`);
          return cacheData.data;
        }
      }
    } catch (error) {
      console.error("Error loading coins from storage:", error);
    }

    // Fetch from API
    return this.fetchAndCacheCoins();
  };

  getMultipleStockQuotes = async (
    symbols: string[],
  ): Promise<Map<string, StockQuote>> => {
    const results = new Map<string, StockQuote>();

    try {
      // Alpaca supports batch requests with comma-separated symbols
      const response = await alpacaDataClient.get<AlpacaLatestBarsResponse>(
        "/v2/stocks/bars/latest",
        {
          params: {
            symbols: symbols.map((s) => s.toUpperCase()).join(","),
            feed: "iex",
          },
        },
      );

      const bars = response.data.bars || {};

      for (const [symbol, bar] of Object.entries(bars)) {
        if (bar && bar.c > 0) {
          const quote: StockQuote = {
            c: bar.c,
            d: 0, // Alpaca doesn't provide change in latest bar
            dp: 0, // Alpaca doesn't provide percent change in latest bar
            h: bar.h,
            l: bar.l,
            o: bar.o,
            pc: bar.o, // Use open as previous close approximation
            t: bar.t,
          };
          results.set(symbol, quote);
        }
      }
    } catch (error) {
      console.error("Error fetching multiple stock quotes:", error);
    }

    return results;
  };
}

export { alpacaDataClient, alpacaPaperClient };
export const api = new Api();
