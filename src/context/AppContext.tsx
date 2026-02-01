import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../services/api";

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: "stock" | "etf" | "crypto" | "gold" | "other";
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
  totalValue: number;
  totalGainLoss: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ASSETS: "buffet_ai_assets",
  ONBOARDED: "buffet_ai_onboarded",
  CHAT: "buffet_ai_chat",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real-time prices for all assets
  const refreshPrices = useCallback(async () => {
    if (assets.length === 0) return;

    const updatedAssets = await Promise.all(
      assets.map(async (asset) => {
        try {
          const price = await api.getStockPrice(asset.symbol);
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
  }, [assets]);

  useEffect(() => {
    loadData();
  }, []);

  // Fetch prices when assets are loaded
  useEffect(() => {
    if (!isLoading && assets.length > 0) {
      refreshPrices();
    }
  }, [isLoading]);

  // Refresh prices every 60 seconds
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

  const loadData = async () => {
    try {
      const [assetsData, onboardedData, chatData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ASSETS),
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDED),
        AsyncStorage.getItem(STORAGE_KEYS.CHAT),
      ]);

      if (assetsData) setAssets(JSON.parse(assetsData));
      if (onboardedData) setHasOnboarded(JSON.parse(onboardedData));
      if (chatData) setChatMessages(JSON.parse(chatData));
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
      let price;
      if (asset.type === "crypto" && asset.cryptoId) {
        price = await api.getCryptoPrice([asset.cryptoId]);
      } else {
        price = await api.getStockPrice(asset.symbol);
        if (price && price > 0) {
          currentPrice = price;
        }
      }
    } catch (error) {
      console.error(`Failed to fetch price for ${asset.symbol}:`, error);
    }

    const newAsset: Asset = {
      ...asset,
      id: Date.now().toString(),
      currentPrice,
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
