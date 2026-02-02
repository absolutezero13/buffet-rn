import AsyncStorage from "@react-native-async-storage/async-storage";
import { Asset } from "./types";
import useUserAssets from "../store/useUserAssets";
import { api } from "./api";
import { CurrencyOption, STORAGE_KEYS } from "../navigation/constants";
import useUserStore from "../store/useUserStore";

class AssetApi {
  constructor() {}

  async getUserAssets(): Promise<Asset[]> {
    const storedAssets = await AsyncStorage.getItem(STORAGE_KEYS.ASSETS);

    if (storedAssets) {
      const assets = JSON.parse(storedAssets) as Asset[];
      useUserAssets.setState({ userAssets: assets });
      return assets;
    }

    return [];
  }

  async addAsset(asset: Omit<Asset, "currentPrice" | "id">): Promise<void> {
    const { userAssets } = useUserAssets.getState();

    const price = await api.getPriceByAssetType(
      asset.type,
      asset.symbol,
      "USD",
    );

    if (!price) {
      console.error("Something went wrong with getting the price", price);
      return;
    }

    const newAsset: Asset = {
      ...asset,
      id: asset.symbol,
      currentPrice: price,
    };

    useUserAssets.setState({ userAssets: [...userAssets, newAsset] });
    await AsyncStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(userAssets));
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

  async getUserCurrency(): Promise<CurrencyOption | null> {
    const userStore = await AsyncStorage.getItem(STORAGE_KEYS.USER);

    const currency = userStore
      ? (JSON.parse(userStore).currency as CurrencyOption)
      : null;
    useUserStore.setState({
      userCurrency: currency,
    });

    let rate: number | null = 1;
    if (currency) {
      rate = await api.getCurrencyRate("USD", currency.id);
    }

    useUserStore.setState({
      conversionRate: rate ?? 1,
    });

    return currency;
  }
}

export const assetApi = new AssetApi();
