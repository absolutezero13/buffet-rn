import { create } from "zustand";

interface SubscriptionStore {
  isSubscribed: boolean;
  setIsSubscribed: (value: boolean) => void;
}

const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  isSubscribed: false,
  setIsSubscribed: (value: boolean) => set({ isSubscribed: value }),
}));

export default useSubscriptionStore;
