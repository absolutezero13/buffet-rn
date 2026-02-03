import { useCallback, useMemo } from "react";
import useCurrencyStore from "../store/useCurrencyStore";
import { CurrencyCode } from "../navigation/constants";
import { Asset } from "../services/types";

/**
 * Hook for currency conversion and formatting utilities
 * All prices from API are in USD, this hook helps convert them to user's currency
 */
export function useCurrency() {
  const {
    userCurrency,
    convertFromUSD,
    convertToUSD,
    convertBetweenCurrencies,
    exchangeRates,
  } = useCurrencyStore();

  /**
   * Format a USD amount in user's currency with symbol
   */
  const formatPrice = useCallback(
    (amountInUSD: number, decimals = 2): string => {
      const converted = convertFromUSD(amountInUSD);
      return `${userCurrency.symbol}${converted.toFixed(decimals)}`;
    },
    [userCurrency, convertFromUSD],
  );

  /**
   * Convert a USD amount to user's currency (number only)
   */
  const toUserCurrency = useCallback(
    (amountInUSD: number): number => {
      return convertFromUSD(amountInUSD);
    },
    [convertFromUSD],
  );

  /**
   * Convert a purchase price from its original currency to user's current currency
   * This is used for showing historical purchase prices in current user currency
   */
  const convertPurchasePrice = useCallback(
    (purchasePrice: number, purchaseCurrency: CurrencyCode): number => {
      return convertBetweenCurrencies(
        purchasePrice,
        purchaseCurrency,
        userCurrency.id,
      );
    },
    [userCurrency, convertBetweenCurrencies],
  );

  /**
   * Get the display value for an asset (current price in user currency)
   * Asset prices from API are always in USD
   */
  const getAssetCurrentValue = useCallback(
    (asset: Asset): number => {
      return convertFromUSD(asset.currentPrice) * asset.quantity;
    },
    [convertFromUSD],
  );

  /**
   * Get the total cost of an asset in user's current currency
   * Takes into account the original purchase currency
   */
  const getAssetTotalCost = useCallback(
    (asset: Asset): number => {
      const purchasePriceInUserCurrency = convertBetweenCurrencies(
        asset.purchasePrice,
        asset.purchaseCurrency as CurrencyCode,
        userCurrency.id,
      );
      return purchasePriceInUserCurrency * asset.quantity;
    },
    [userCurrency, convertBetweenCurrencies],
  );

  /**
   * Get asset gain/loss in user's currency
   */
  const getAssetGainLoss = useCallback(
    (
      asset: Asset,
    ): {
      gainLoss: number;
      gainLossPercent: number;
      isPositive: boolean;
    } => {
      const currentValue = getAssetCurrentValue(asset);
      const totalCost = getAssetTotalCost(asset);
      const gainLoss = currentValue - totalCost;
      const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;

      return {
        gainLoss,
        gainLossPercent,
        isPositive: gainLoss >= 0,
      };
    },
    [getAssetCurrentValue, getAssetTotalCost],
  );

  /**
   * Get the purchase price per unit in user's current currency
   */
  const getAssetPurchasePrice = useCallback(
    (asset: Asset): number => {
      return convertBetweenCurrencies(
        asset.purchasePrice,
        asset.purchaseCurrency as CurrencyCode,
        userCurrency.id,
      );
    },
    [userCurrency, convertBetweenCurrencies],
  );

  /**
   * Get the current price per unit in user's currency
   * (API returns prices in USD)
   */
  const getAssetCurrentPrice = useCallback(
    (asset: Asset): number => {
      return convertFromUSD(asset.currentPrice);
    },
    [convertFromUSD],
  );

  return {
    userCurrency,
    currencySymbol: userCurrency.symbol,
    exchangeRates,
    formatPrice,
    toUserCurrency,
    convertPurchasePrice,
    getAssetCurrentValue,
    getAssetTotalCost,
    getAssetGainLoss,
    getAssetPurchasePrice,
    getAssetCurrentPrice,
  };
}
