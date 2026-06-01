import { create } from "zustand";
import { CurrencyCode } from "../navigation/constants";

export type BillingCycle = "weekly" | "monthly" | "yearly";

export interface UserSubscription {
  id: string;
  serviceId: string;
  name: string;
  category: string;
  amount: number;
  currency: CurrencyCode;
  billingCycle: BillingCycle;
  createdAt: number;
}

interface RecurringSubscriptionsStore {
  subscriptions: UserSubscription[];
  isLoading: boolean;
}

const useRecurringSubscriptionsStore = create<RecurringSubscriptionsStore>(
  () => ({
    subscriptions: [],
    isLoading: false,
  }),
);

export default useRecurringSubscriptionsStore;
