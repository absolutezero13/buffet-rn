import { create } from "zustand";

interface UserStore {
  hasOnboarded?: boolean;
}

const useUserStore = create<UserStore>(() => ({
  hasOnboarded: false,
}));

export default useUserStore;
