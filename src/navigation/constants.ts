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

export type WeightUnit = "ONS" | "GRAM";

export type WeightUnitOption = {
  id: WeightUnit;
  label: string;
  fullName: string;
};

export const weightUnitOptions: WeightUnitOption[] = [
  {
    id: "ONS",
    label: "oz",
    fullName: "Troy Ounce",
  },
  {
    id: "GRAM",
    label: "g",
    fullName: "Gram",
  },
];

// 1 Troy Ounce = 31.1035 grams
export const TROY_OUNCE_TO_GRAM = 31.1035;

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
