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
