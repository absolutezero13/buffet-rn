import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, AssetType } from "../services/api";
import { CurrencyCode, CurrencyOption } from "../navigation/constants";

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: AssetType;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  cryptoId?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface AppContextType {
  assets: Asset[];
  addAsset: (asset: Omit<Asset, "id" | "currentPrice">) => void;
  deleteAsset: (id: string) => void;
  updateAssetPrice: (id: string, price: number) => void;
  refreshPrices: () => Promise<void>;
  chatMessages: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  clearChat: () => void;
  hasOnboarded: boolean;
  setHasOnboarded: (value: boolean) => void;
  userCurrency: CurrencyOption | null;
  setUserCurrency: (currency: CurrencyOption | null) => void;
  resetApp: () => Promise<void>;
  totalValue: number;
  totalGainLoss: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ASSETS: "buffet_ai_assets",
  ONBOARDED: "buffet_ai_onboarded",
  CHAT: "buffet_ai_chat",
  BASE_CURRENCY: "buffet_ai_base_currency",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [userCurrency, setUserCurrency] = useState<CurrencyOption | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real-time prices for all assets
  const refreshPrices = useCallback(async () => {
    if (assets.length === 0) return;

    const updatedAssets = await Promise.all(
      assets.map(async (asset) => {
        try {
          const identifier =
            asset.type === "crypto" && asset.cryptoId
              ? asset.cryptoId
              : asset.symbol;
          const price = await api.getPriceByAssetType(
            asset.type,
            identifier,
            userCurrency?.id ?? "USD",
          );
          console.log(`Fetched price for ${asset.symbol}:`, price);
          if (price && price > 0) {
            return { ...asset, currentPrice: price };
          }
        } catch (error) {
          console.error(`Failed to fetch price for ${asset.symbol}:`, error);
        }
        return asset;
      }),
    );

    setAssets(updatedAssets);
  }, [assets, userCurrency]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading && assets.length > 0) {
      refreshPrices();
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading || assets.length === 0) return;

    const interval = setInterval(() => {
      // refreshPrices();
    }, 60000);

    return () => clearInterval(interval);
  }, [isLoading, assets.length]);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
    }
  }, [assets, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(
        STORAGE_KEYS.ONBOARDED,
        JSON.stringify(hasOnboarded),
      );
    }
  }, [hasOnboarded, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(
        STORAGE_KEYS.BASE_CURRENCY,
        JSON.stringify(userCurrency),
      );
    }
  }, [userCurrency, isLoading]);

  const loadData = async () => {
    try {
      const [assetsData, onboardedData, chatData, baseCurrencyData] =
        await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.ASSETS),
          AsyncStorage.getItem(STORAGE_KEYS.ONBOARDED),
          AsyncStorage.getItem(STORAGE_KEYS.CHAT),
          AsyncStorage.getItem(STORAGE_KEYS.BASE_CURRENCY),
        ]);

      if (assetsData) setAssets(JSON.parse(assetsData));
      if (onboardedData) setHasOnboarded(JSON.parse(onboardedData));
      if (chatData) setChatMessages(JSON.parse(chatData));
      if (baseCurrencyData) {
        setUserCurrency(JSON.parse(baseCurrencyData));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addAsset = async (asset: Omit<Asset, "id" | "currentPrice">) => {
    // Fetch current price immediately when adding
    let currentPrice = asset.purchasePrice;
    try {
      const identifier =
        asset.type === "crypto" && asset.cryptoId
          ? asset.cryptoId
          : asset.symbol;
      const price = await api.getPriceByAssetType(
        asset.type,
        identifier,
        userCurrency?.id ?? "USD",
      );
      if (price && price > 0) {
        currentPrice = price;
      }
    } catch (error) {
      console.error(`Failed to fetch price for ${asset.symbol}:`, error);
    }

    const newAsset: Asset = {
      ...asset,
      id: Date.now().toString(),
      currentPrice,
      purchasePrice:
        asset.type === "cash" && currentPrice > 0
          ? currentPrice
          : asset.purchasePrice,
    };
    setAssets((prev) => [...prev, newAsset]);
  };

  const deleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== id));
  };

  const updateAssetPrice = (id: string, price: number) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === id ? { ...asset, currentPrice: price } : asset,
      ),
    );
  };

  const addChatMessage = (message: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setChatMessages((prev) => {
      const updated = [...prev, newMessage];
      AsyncStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(updated));
      return updated;
    });
  };

  const clearChat = () => {
    setChatMessages([]);
    AsyncStorage.removeItem(STORAGE_KEYS.CHAT);
  };

  const resetApp = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ASSETS,
        STORAGE_KEYS.ONBOARDED,
        STORAGE_KEYS.CHAT,
        STORAGE_KEYS.BASE_CURRENCY,
      ]);
    } catch (error) {
      console.error("Error clearing app data:", error);
    } finally {
      setAssets([]);
      setChatMessages([]);
      setHasOnboarded(false);
    }
  };

  const totalValue = assets.reduce(
    (sum, asset) => sum + asset.currentPrice * asset.quantity,
    0,
  );
  const totalCost = assets.reduce(
    (sum, asset) => sum + asset.purchasePrice * asset.quantity,
    0,
  );
  const totalGainLoss = totalValue - totalCost;

  if (isLoading) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        assets,
        addAsset,
        deleteAsset,
        updateAssetPrice,
        refreshPrices,
        chatMessages,
        addChatMessage,
        clearChat,
        hasOnboarded,
        setHasOnboarded,
        userCurrency,
        setUserCurrency,
        resetApp,
        totalValue,
        totalGainLoss,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
