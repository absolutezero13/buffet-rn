import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  WeightUnit,
  WeightUnitOption,
  weightUnitOptions,
  TROY_OUNCE_TO_GRAM,
} from "../navigation/constants";

const STORAGE_KEY_WEIGHT_UNIT = "WEIGHT_UNIT";

interface WeightUnitStore {
  weightUnit: WeightUnitOption;

  // Actions
  setWeightUnit: (unit: WeightUnitOption) => Promise<void>;
  initializeWeightUnit: () => Promise<void>;

  // Conversion helpers
  convertFromOunce: (pricePerOunce: number) => number;
  getUnitLabel: () => string;
}

const defaultWeightUnit = weightUnitOptions[0]; // ONS (Troy Ounce)

const useWeightUnitStore = create<WeightUnitStore>((set, get) => ({
  weightUnit: defaultWeightUnit,

  initializeWeightUnit: async () => {
    try {
      const savedUnit = await AsyncStorage.getItem(STORAGE_KEY_WEIGHT_UNIT);
      if (savedUnit) {
        const unit = JSON.parse(savedUnit) as WeightUnitOption;
        set({ weightUnit: unit });
      }
    } catch (error) {
      console.error("Error initializing weight unit store:", error);
    }
  },

  setWeightUnit: async (unit: WeightUnitOption) => {
    set({ weightUnit: unit });
    await AsyncStorage.setItem(STORAGE_KEY_WEIGHT_UNIT, JSON.stringify(unit));
  },

  /**
   * Convert price from per-ounce to user's selected weight unit
   * Commodity prices are always fetched in USD per troy ounce
   */
  convertFromOunce: (pricePerOunce: number): number => {
    const { weightUnit } = get();
    if (weightUnit.id === "GRAM") {
      return pricePerOunce / TROY_OUNCE_TO_GRAM;
    }
    return pricePerOunce;
  },

  /**
   * Get the display label for the current weight unit
   */
  getUnitLabel: (): string => {
    return get().weightUnit.label;
  },
}));

export default useWeightUnitStore;
