import { create } from "zustand";
import { CurrencyOption } from "../navigation/constants";

interface UserStore {
  userCurrency: CurrencyOption | null;
  hasOnboarded?: boolean;
  conversionRate: number;
}

const useUserStore = create<UserStore>(() => ({
  userCurrency: null,
  hasOnboarded: false,
  conversionRate: 1,
}));

export default useUserStore;
