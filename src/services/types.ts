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

export type AssetType = "stock" | "etf" | "crypto" | "gold" | "cash" | "other";

export interface SwissquoteBboQuote {
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

export interface ExchangeRateResponse {
  rate: number;
  symbol: string;
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
