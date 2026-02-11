import { create } from "zustand";

interface UserStore {
  hasOnboarded?: boolean;
  onboardingCompleted?: boolean;
  isInitialized: boolean;
}

const useUserStore = create<UserStore>(() => ({
  hasOnboarded: false,
  onboardingCompleted: false,
  isInitialized: false,
}));

export default useUserStore;
