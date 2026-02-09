import { SearchResult } from "../components";

export type CurrencyCode = "USD" | "EUR" | "GBP";

export type CurrencyOption = {
  id: CurrencyCode;
  label: string;
  symbol: string;
};

export const currencyOptions: CurrencyOption[] = [
  {
    id: "USD",
    label: "USD",
    symbol: "$",
  },
  {
    id: "EUR",
    label: "EUR",
    symbol: "€",
  },
  {
    id: "GBP",
    label: "GBP",
    symbol: "£",
  },
];

export const COMMODITY_OPTIONS: SearchResult[] = [
  { symbol: "XAU", name: "Gold", yahoofinanceId: "GC=F" },
  { symbol: "XAG", name: "Silver", yahoofinanceId: "SI=F" },
  { symbol: "XPT", name: "Platinum", yahoofinanceId: "PL=F" },
  { symbol: "XPD", name: "Palladium", yahoofinanceId: "PA=F" },
];
export const STORAGE_KEYS = {
  ASSETS: "USER_ASSETS",
  USER: "USER",
  ALPACA_ASSETS: "ALPACA_ASSETS",
  COINGECKO_COINS: "COINGECKO_COINS",
};
