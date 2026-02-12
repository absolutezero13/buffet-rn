import { useCallback, useMemo } from "react";
import useCurrencyStore from "../store/useCurrencyStore";
import useWeightUnitStore from "../store/useWeightUnitStore";
import { CurrencyCode, COMMODITY_OPTIONS, TROY_OUNCE_TO_GRAM } from "../navigation/constants";
import { Asset } from "../services/types";

/**
 * Check if an asset is a commodity (precious metal)
 */
const isCommodityAsset = (asset: Asset): boolean => {
  return (
    asset.type === "gold" ||
    COMMODITY_OPTIONS.some((c) => c.symbol === asset.symbol)
  );
};

/**
 * Hook for currency conversion and formatting utilities
 * All prices from API are in USD, this hook helps convert them to user's currency
 * Commodity prices are always in USD per troy ounce - converted to user's weight unit
 */
export function useCurrency() {
  const {
    userCurrency,
    convertFromUSD,
    convertToUSD,
    convertBetweenCurrencies,
    exchangeRates,
  } = useCurrencyStore();

  const { weightUnit, convertFromOunce, getUnitLabel } = useWeightUnitStore();

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
   * Format a commodity price (per ounce from API) in user's currency and weight unit
   * @param pricePerOunceUSD - Price in USD per troy ounce
   */
  const formatCommodityPrice = useCallback(
    (pricePerOunceUSD: number, decimals = 2): string => {
      const priceInUserCurrency = convertFromUSD(pricePerOunceUSD);
      const priceInUserUnit = convertFromOunce(priceInUserCurrency);
      return `${userCurrency.symbol}${priceInUserUnit.toFixed(decimals)}/${getUnitLabel()}`;
    },
    [userCurrency, convertFromUSD, convertFromOunce, getUnitLabel],
  );

  /**
   * Convert a commodity price from per-ounce USD to user's currency and weight unit
   * @param pricePerOunceUSD - Price in USD per troy ounce
   */
  const convertCommodityPrice = useCallback(
    (pricePerOunceUSD: number): number => {
      const priceInUserCurrency = convertFromUSD(pricePerOunceUSD);
      return convertFromOunce(priceInUserCurrency);
    },
    [convertFromUSD, convertFromOunce],
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
   * Note: For commodities, the total value is still price * quantity (quantity is in the original unit)
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
   * For commodities, converts to user's weight unit
   */
  const getAssetPurchasePrice = useCallback(
    (asset: Asset): number => {
      const priceInUserCurrency = convertBetweenCurrencies(
        asset.purchasePrice,
        asset.purchaseCurrency as CurrencyCode,
        userCurrency.id,
      );
      // For commodities, convert from per-ounce to user's weight unit
      if (isCommodityAsset(asset)) {
        return convertFromOunce(priceInUserCurrency);
      }
      return priceInUserCurrency;
    },
    [userCurrency, convertBetweenCurrencies, convertFromOunce],
  );

  /**
   * Get the current price per unit in user's currency
   * For commodities, converts to user's weight unit
   * (API returns prices in USD per troy ounce for commodities)
   */
  const getAssetCurrentPrice = useCallback(
    (asset: Asset): number => {
      const priceInUserCurrency = convertFromUSD(asset.currentPrice);
      // For commodities, convert from per-ounce to user's weight unit
      if (isCommodityAsset(asset)) {
        return convertFromOunce(priceInUserCurrency);
      }
      return priceInUserCurrency;
    },
    [convertFromUSD, convertFromOunce],
  );

  /**
   * Get the display quantity for an asset
   * For commodities, converts from troy ounces to user's weight unit
   * (Commodities are stored in troy ounces)
   */
  const getAssetDisplayQuantity = useCallback(
    (asset: Asset): number => {
      if (isCommodityAsset(asset)) {
        // If user prefers grams, convert from ounces to grams
        if (weightUnit.id === "GRAM") {
          return asset.quantity * TROY_OUNCE_TO_GRAM;
        }
      }
      return asset.quantity;
    },
    [weightUnit],
  );

  /**
   * Get the unit label for quantity display
   * For commodities, returns the weight unit label (oz or g)
   * For other assets, returns empty string
   */
  const getAssetQuantityUnit = useCallback(
    (asset: Asset): string => {
      if (isCommodityAsset(asset)) {
        return weightUnit.label;
      }
      return "";
    },
    [weightUnit],
  );

  return {
    userCurrency,
    weightUnit,
    weightUnitLabel: getUnitLabel(),
    currencySymbol: userCurrency.symbol,
    exchangeRates,
    formatPrice,
    formatCommodityPrice,
    convertCommodityPrice,
    toUserCurrency,
    convertPurchasePrice,
    getAssetCurrentValue,
    getAssetTotalCost,
    getAssetGainLoss,
    getAssetPurchasePrice,
    getAssetCurrentPrice,
    getAssetDisplayQuantity,
    getAssetQuantityUnit,
    isCommodityAsset,
  };
}
