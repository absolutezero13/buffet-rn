import { Asset } from "../services/types";
import { create } from "zustand";

export interface UserAssetStore {
  userAssets: Asset[];
}

const useUserAssets = create<UserAssetStore>(() => ({
  userAssets: [],
}));

export default useUserAssets;
