// Alpaca Markets API types
export interface AlpacaBar {
  t: string; // Timestamp (RFC-3339)
  o: number; // Open price
  h: number; // High price
  l: number; // Low price
  c: number; // Close price
  v: number; // Volume
  n: number; // Number of trades
  vw: number; // Volume weighted average price
}

export interface AlpacaBarsResponse {
  bars: Record<string, AlpacaBar[]>;
  next_page_token: string | null;
}

export interface AlpacaLatestBar {
  symbol: string;
  bar: AlpacaBar;
}

export interface AlpacaLatestBarsResponse {
  bars: Record<string, AlpacaBar>;
}

export interface AlpacaAsset {
  id: string;
  class: string;
  exchange: string;
  symbol: string;
  name: string;
  status: string;
  tradable: boolean;
  marginable: boolean;
  shortable: boolean;
  easy_to_borrow: boolean;
  fractionable: boolean;
}

// CoinGecko API types
export interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
}

export type AssetType = "stock" | "etf" | "crypto" | "gold" | "cash" | "other";

export interface SwissquoteBboQuote {
  spreadProfilePrices: Array<{
    spreadProfile: string;
    bid?: number;
    ask?: number;
  }>;
  ts: number;
}

export interface YahooFinanceChartResponse {
  chart: {
    result: Array<{
      meta: {
        currency: string;
        symbol: string;
        regularMarketPrice: number;
        fiftyTwoWeekHigh: number;
        fiftyTwoWeekLow: number;
      };
      timestamp: number[];
      indicators: {
        quote: Array<{
          low: number[];
          volume: number[];
          open: number[];
          high: number[];
          close: number[];
        }>;
        adjclose?: Array<{
          adjclose: number[];
        }>;
      };
    }>;
    error: null | { code: string; description: string };
  };
}

// Stock quote interface (compatible with Alpaca bar data)
export interface StockQuote {
  c: number; // Current price (close)
  d: number; // Change
  dp: number; // Percent change
  h: number; // High
  l: number; // Low
  o: number; // Open
  pc: number; // Previous close
  t: string; // Timestamp (RFC-3339)
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  timestamp: number;
}

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: AssetType;
  quantity: number;
  purchasePrice: number;
  purchaseCurrency: string;
  currentPrice: number;
}
