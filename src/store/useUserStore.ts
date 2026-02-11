import { create } from "zustand";

interface UserStore {
  hasOnboarded?: boolean;
  onboardingCompleted?: boolean;
}

const useUserStore = create<UserStore>(() => ({
  hasOnboarded: false,
  onboardingCompleted: false,
}));

export default useUserStore;
