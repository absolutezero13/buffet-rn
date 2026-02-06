import AsyncStorage from "@react-native-async-storage/async-storage";
import { Asset } from "./types";
import useUserAssets from "../store/useUserAssets";
import { api } from "./api";
import { STORAGE_KEYS } from "../navigation/constants";
import useCurrencyStore from "../store/useCurrencyStore";

class AssetApi {
  constructor() {}

  async getUserAssets(): Promise<Asset[]> {
    const storedAssets = await AsyncStorage.getItem(STORAGE_KEYS.ASSETS);
    console.log("getUserAssets storedAssets", storedAssets);

    // Initialize currency store (will fetch rates if needed)
    await useCurrencyStore.getState().initializeCurrency();

    if (storedAssets) {
      const assets = JSON.parse(storedAssets) as Asset[];

      // Always fetch prices in USD
      const pricePromises = assets.map(async (asset) => {
        if (asset.type && asset.symbol) {
          return api.getPriceByAssetType(asset.type, asset.symbol, "USD");
        }
      });

      const prices = await Promise.all(pricePromises);

      // Store prices in USD - conversion happens in UI
      const updatedAssets = assets.map((asset, index) => ({
        ...asset,
        currentPrice: prices[index] || asset.currentPrice,
      }));
      console.log("getUserAssets all assets =>", updatedAssets);
      useUserAssets.setState({ userAssets: updatedAssets });
      await AsyncStorage.setItem(
        STORAGE_KEYS.ASSETS,
        JSON.stringify(updatedAssets),
      );
      return assets;
    }

    return [];
  }

  async addAsset(asset: Omit<Asset, "currentPrice" | "id">): Promise<void> {
    const { userAssets } = useUserAssets.getState();
    const { convertToUSD } = useCurrencyStore.getState();

    // Always fetch price in USD
    const priceInUSD = await api.getPriceByAssetType(
      asset.type,
      asset.symbol,
      "USD",
    );

    if (!priceInUSD && priceInUSD !== 0) {
      console.error("Something went wrong with getting the price", priceInUSD);
      return;
    }

    // Convert purchase price to USD for storage if user entered in their currency
    // This ensures all stored prices are in USD
    const purchasePriceInUSD = convertToUSD(
      asset.purchasePrice,
      asset.purchaseCurrency as "USD" | "EUR" | "GBP",
    );

    // Check if the asset already exists in the portfolio (same symbol and type)
    const existingAssetIndex = userAssets.findIndex(
      (a) => a.symbol === asset.symbol && a.type === asset.type,
    );

    let updatedAssets: Asset[];

    if (existingAssetIndex !== -1) {
      // Asset exists - update quantity and calculate weighted average purchase price
      const existingAsset = userAssets[existingAssetIndex];
      const totalQuantity = existingAsset.quantity + asset.quantity;
      const weightedAvgPurchasePrice =
        (existingAsset.purchasePrice * existingAsset.quantity +
          purchasePriceInUSD * asset.quantity) /
        totalQuantity;

      const updatedAsset: Asset = {
        ...existingAsset,
        quantity: totalQuantity,
        purchasePrice: weightedAvgPurchasePrice,
        currentPrice: priceInUSD,
      };

      updatedAssets = [...userAssets];
      updatedAssets[existingAssetIndex] = updatedAsset;
    } else {
      // New asset - create new entry
      const newAsset: Asset = {
        ...asset,
        id: asset.symbol,
        currentPrice: priceInUSD,
        purchasePrice: purchasePriceInUSD,
        purchaseCurrency: "USD", // Always store in USD
      };

      updatedAssets = [...userAssets, newAsset];
    }

    useUserAssets.setState({ userAssets: updatedAssets });
    await AsyncStorage.setItem(
      STORAGE_KEYS.ASSETS,
      JSON.stringify(updatedAssets),
    );
  }

  async deletAsset(id: string): Promise<void> {
    const { userAssets } = useUserAssets.getState();
    const updatedAssets = userAssets.filter((asset) => asset.id !== id);

    useUserAssets.setState({ userAssets: updatedAssets });
    await AsyncStorage.setItem(
      STORAGE_KEYS.ASSETS,
      JSON.stringify(updatedAssets),
    );
  }

  async refreshPrices(): Promise<void> {
    const { userAssets } = useUserAssets.getState();

    if (userAssets.length === 0) return;

    // Fetch all prices in USD
    const pricePromises = userAssets.map(async (asset) => {
      if (asset.type && asset.symbol) {
        return api.getPriceByAssetType(asset.type, asset.symbol, "USD");
      }
      return null;
    });

    const prices = await Promise.all(pricePromises);

    const updatedAssets = userAssets.map((asset, index) => ({
      ...asset,
      currentPrice: prices[index] ?? asset.currentPrice,
    }));

    useUserAssets.setState({ userAssets: updatedAssets });
    await AsyncStorage.setItem(
      STORAGE_KEYS.ASSETS,
      JSON.stringify(updatedAssets),
    );
  }
}

export const assetApi = new AssetApi();
