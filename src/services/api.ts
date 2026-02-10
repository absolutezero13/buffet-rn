import axios from "axios";
import { COMMODITY_OPTIONS, CurrencyCode } from "../navigation/constants";
import {
  StockQuote,
  AssetType,
  PriceHistoryPoint,
  AlpacaBar,
  CoinGeckoCoin,
} from "./types";

// Backend API base URL
const API_BASE = "https://api-cq6jajwdtq-uc.a.run.app/api";

export const apiClient = axios.create({
  baseURL: API_BASE,
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

      const response = await apiClient.get<{ rate: number | null }>(
        "/currency-rate",
        {
          params: { from, to },
        },
      );
      console.log("Currency conversion response:", response.data);

      return response.data?.rate ?? null;
    } catch (error) {
      console.error("Error converting currency:", error);
      return null;
    }
  };

  getStockPrice = async (symbol: string): Promise<number | null> => {
    try {
      const response = await apiClient.get<{ price: number | null }>(
        "/stock-price",
        {
          params: { symbol: symbol.toUpperCase() },
        },
      );

      console.log("Stock price response:", response.data);
      return response.data?.price ?? null;
    } catch (error) {
      console.error("Error fetching stock price:", error);
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

    try {
      switch (assetType) {
        case "stock":
        case "etf":
          return await this.getStockPrice(identifier);
        case "crypto":
          return await this.getCryptoPrice(identifier, baseCurrency);
        case "gold":
          return await this.getCommodityPrice(identifier);
        default:
          return null;
      }
    } catch (error) {
      console.error("Error fetching price by asset type:", error);
      return null;
    }
  };

  getStockQuoteFull = async (symbol: string): Promise<AlpacaBar | null> => {
    try {
      const response = await apiClient.get<{ quote: AlpacaBar | null }>(
        "/stock-quote",
        {
          params: { symbol: symbol.toUpperCase() },
        },
      );
      return response.data?.quote ?? null;
    } catch (error) {
      console.error("Error fetching full stock quote:", error);
      return null;
    }
  };

  getCryptoPrice = async (
    coinId: string,
    baseCurrency: CurrencyCode = "USD",
  ): Promise<number | null> => {
    try {
      const response = await apiClient.get<{ price: number | null }>(
        "/crypto-price",
        {
          params: {
            coinId,
            currency: baseCurrency.toLowerCase(),
          },
        },
      );

      return response.data?.price ?? null;
    } catch (error) {
      console.error("Error fetching crypto price:", error);
      return null;
    }
  };

  getCommodityPrice = async (symbol: string): Promise<number | null> => {
    try {
      const response = await apiClient.get<{ price: number | null }>(
        "/commodity-price",
        {
          params: { symbol: symbol.toUpperCase() },
        },
      );

      console.log("Commodity price fetched:", response.data);
      return response.data?.price ?? null;
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
      const response = await apiClient.get<{ history: PriceHistoryPoint[] }>(
        "/crypto-history",
        {
          params: {
            coinId,
            days,
            currency: baseCurrency.toLowerCase(),
          },
        },
      );

      console.log("Crypto history response:", response.data);
      return response.data?.history || [];
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
      const yahooId = COMMODITY_OPTIONS.find(
        (c) => c.symbol === symbol,
      )?.yahoofinanceId;
      const response = await apiClient.get<{ history: PriceHistoryPoint[] }>(
        "/commodity-history",
        {
          params: { symbol: yahooId, days },
        },
      );

      console.log("Commodity history response:", response.data);
      return response.data?.history || [];
    } catch (error) {
      console.error("Error fetching commodity history:", error);
      return [];
    }
  };

  getStockHistory = async (
    symbol: string,
    days: number,
  ): Promise<PriceHistoryPoint[]> => {
    try {
      console.log("Fetching stock history with params:", { symbol, days });
      const response = await apiClient.get<{ history: PriceHistoryPoint[] }>(
        "/stock-history",
        {
          params: {
            symbol: symbol.toUpperCase(),
            days,
          },
        },
      );
      console.log("Stock history response:", response.data);
      return response.data?.history || [];
    } catch (error) {
      console.error("Error fetching stock history:", error);
      return [];
    }
  };

  // Search symbol from backend (with caching for performance)
  searchSymbol = async (
    query: string,
  ): Promise<{ symbol: string; description: string }[]> => {
    try {
      const response = await apiClient.get<{
        results: { symbol: string; description: string }[];
      }>("/search-symbol", {
        params: { query },
      });

      return response.data?.results || [];
    } catch (error) {
      console.error("Error searching symbol:", error);
      return [];
    }
  };

  // Search crypto from backend (with caching for performance)
  searchCrypto = async (
    query: string,
  ): Promise<{ id: string; symbol: string; name: string }[]> => {
    try {
      const response = await apiClient.get<{
        results: CoinGeckoCoin[];
      }>("/search-crypto", {
        params: { query },
      });

      console.log("searchCrypto response:", response.data);
      return response.data?.results || [];
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
      const response = await apiClient.get<{
        quotes: Record<string, StockQuote>;
      }>("/stock-quotes", {
        params: {
          symbols: symbols.map((s) => s.toUpperCase()).join(","),
        },
      });

      const quotes = response.data?.quotes || {};

      for (const [symbol, quote] of Object.entries(quotes)) {
        results.set(symbol, quote);
      }
    } catch (error) {
      console.error("Error fetching multiple stock quotes:", error);
    }

    return results;
  };
}

export const api = new Api();
