import { Asset } from "../services/types";
import { create } from "zustand";

export interface UserAssetStore {
  userAssets: Asset[];
  isLoading: boolean;
}

const useUserAssets = create<UserAssetStore>(() => ({
  userAssets: [],
  isLoading: false,
}));

export default useUserAssets;
