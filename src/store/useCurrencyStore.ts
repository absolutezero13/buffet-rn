import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CurrencyCode,
  CurrencyOption,
  currencyOptions,
} from "../navigation/constants";
import { api } from "../services/api";

// Cache duration: 1 hour in milliseconds
const CACHE_DURATION_MS = 60 * 60 * 1000;

interface ExchangeRates {
  // Rates from USD to other currencies
  USD: number; // Always 1
  EUR: number;
  GBP: number;
  TRY: number;
  lastUpdated: number;
}

interface CurrencyStore {
  userCurrency: CurrencyOption;
  exchangeRates: ExchangeRates;
  isLoadingRates: boolean;

  // Actions
  setUserCurrency: (currency: CurrencyOption) => Promise<void>;
  fetchExchangeRates: (force?: boolean) => Promise<void>;
  convertFromUSD: (amountInUSD: number) => number;
  convertToUSD: (amount: number, fromCurrency: CurrencyCode) => number;
  convertBetweenCurrencies: (
    amount: number,
    from: CurrencyCode,
    to: CurrencyCode,
  ) => number;
  initializeCurrency: () => Promise<void>;
}

const STORAGE_KEY_RATES = "EXCHANGE_RATES";
const STORAGE_KEY_CURRENCY = "USER_CURRENCY";

const defaultRates: ExchangeRates = {
  USD: 1,
  EUR: 0.92, // Fallback rates
  GBP: 0.79,
  TRY: 45.89,
  lastUpdated: 0,
};

const defaultCurrency = currencyOptions[0]; // USD

const hasValidExchangeRates = (rates: Partial<ExchangeRates>) =>
  typeof rates.USD === "number" &&
  typeof rates.EUR === "number" &&
  typeof rates.GBP === "number" &&
  typeof rates.TRY === "number" &&
  rates.USD === 1 &&
  rates.EUR > 0 &&
  rates.GBP > 0 &&
  rates.TRY > 1;

const useCurrencyStore = create<CurrencyStore>((set, get) => ({
  userCurrency: defaultCurrency,
  exchangeRates: defaultRates,
  isLoadingRates: false,

  initializeCurrency: async () => {
    try {
      // Load saved currency preference
      const savedCurrency = await AsyncStorage.getItem(STORAGE_KEY_CURRENCY);
      if (savedCurrency) {
        const currency = JSON.parse(savedCurrency) as CurrencyOption;
        set({ userCurrency: currency });
      }

      // Load cached exchange rates
      const cachedRates = await AsyncStorage.getItem(STORAGE_KEY_RATES);
      if (cachedRates) {
        const rates = JSON.parse(cachedRates) as Partial<ExchangeRates>;
        set({ exchangeRates: { ...defaultRates, ...rates } });
      }

      // Fetch fresh rates if cache is expired
      await get().fetchExchangeRates();
    } catch (error) {
      console.error("Error initializing currency store:", error);
    }
  },

  setUserCurrency: async (currency: CurrencyOption) => {
    set({ userCurrency: currency });
    await AsyncStorage.setItem(STORAGE_KEY_CURRENCY, JSON.stringify(currency));

    // Ensure we have fresh rates when currency changes
    await get().fetchExchangeRates();
  },

  fetchExchangeRates: async (force = false) => {
    const { exchangeRates, isLoadingRates } = get();

    // Don't fetch if already loading
    if (isLoadingRates) return;

    // Check if cache is still valid (unless forced)
    const now = Date.now();
    const cacheAge = now - exchangeRates.lastUpdated;
    const hasCompleteCache = hasValidExchangeRates(exchangeRates);
    if (
      !force &&
      hasCompleteCache &&
      cacheAge < CACHE_DURATION_MS &&
      exchangeRates.lastUpdated > 0
    ) {
      console.log(
        "Using cached exchange rates, age:",
        Math.round(cacheAge / 1000 / 60),
        "minutes",
      );
      return;
    }

    set({ isLoadingRates: true });

    try {
      console.log("Fetching fresh exchange rates...");

      const [eurRate, gbpRate, tryRate] = await Promise.all([
        api.getCurrencyRate("USD", "EUR"),
        api.getCurrencyRate("USD", "GBP"),
        api.getCurrencyRate("USD", "TRY"),
      ]);

      const newRates: ExchangeRates = {
        USD: 1,
        EUR:
          eurRate ??
          (exchangeRates.EUR > 0 ? exchangeRates.EUR : defaultRates.EUR),
        GBP:
          gbpRate ??
          (exchangeRates.GBP > 0 ? exchangeRates.GBP : defaultRates.GBP),
        TRY:
          tryRate ??
          (exchangeRates.TRY > 1 ? exchangeRates.TRY : defaultRates.TRY),
        lastUpdated: now,
      };

      set({ exchangeRates: newRates });
      await AsyncStorage.setItem(STORAGE_KEY_RATES, JSON.stringify(newRates));

      console.log("Exchange rates updated:", newRates);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      // Keep using cached rates on error
    } finally {
      set({ isLoadingRates: false });
    }
  },

  convertFromUSD: (amountInUSD: number): number => {
    const { userCurrency, exchangeRates } = get();
    const rate = exchangeRates[userCurrency.id] ?? defaultRates[userCurrency.id];
    return amountInUSD * rate;
  },

  convertToUSD: (amount: number, fromCurrency: CurrencyCode): number => {
    const { exchangeRates } = get();
    const rate = exchangeRates[fromCurrency] ?? defaultRates[fromCurrency];
    // To convert TO USD, we divide by the rate (since rates are USD -> other)
    return amount / rate;
  },

  convertBetweenCurrencies: (
    amount: number,
    from: CurrencyCode,
    to: CurrencyCode,
  ): number => {
    if (from === to) return amount;

    const { exchangeRates } = get();
    // First convert to USD, then to target currency
    const fromRate = exchangeRates[from] ?? defaultRates[from];
    const toRate = exchangeRates[to] ?? defaultRates[to];
    const amountInUSD = amount / fromRate;
    return amountInUSD * toRate;
  },
}));

export default useCurrencyStore;
