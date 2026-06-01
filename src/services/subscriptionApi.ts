import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../navigation/constants";
import useRecurringSubscriptionsStore, {
  UserSubscription,
} from "../store/useRecurringSubscriptionsStore";

class SubscriptionApi {
  async getUserSubscriptions(): Promise<UserSubscription[]> {
    useRecurringSubscriptionsStore.setState({ isLoading: true });

    try {
      const storedSubscriptions = await AsyncStorage.getItem(
        STORAGE_KEYS.SUBSCRIPTIONS,
      );

      if (!storedSubscriptions) {
        return [];
      }

      const subscriptions = JSON.parse(
        storedSubscriptions,
      ) as UserSubscription[];
      useRecurringSubscriptionsStore.setState({ subscriptions });

      return subscriptions;
    } finally {
      useRecurringSubscriptionsStore.setState({ isLoading: false });
    }
  }

  async addSubscription(
    subscription: Omit<UserSubscription, "id" | "createdAt">,
  ): Promise<void> {
    const { subscriptions } = useRecurringSubscriptionsStore.getState();
    const existingSubscriptionIndex = subscriptions.findIndex(
      (item) => item.serviceId === subscription.serviceId,
    );

    let updatedSubscriptions: UserSubscription[];

    if (existingSubscriptionIndex !== -1) {
      updatedSubscriptions = [...subscriptions];
      updatedSubscriptions[existingSubscriptionIndex] = {
        ...updatedSubscriptions[existingSubscriptionIndex],
        ...subscription,
      };
    } else {
      updatedSubscriptions = [
        ...subscriptions,
        {
          ...subscription,
          id: `${subscription.serviceId}-${Date.now()}`,
          createdAt: Date.now(),
        },
      ];
    }

    useRecurringSubscriptionsStore.setState({
      subscriptions: updatedSubscriptions,
    });
    await AsyncStorage.setItem(
      STORAGE_KEYS.SUBSCRIPTIONS,
      JSON.stringify(updatedSubscriptions),
    );
  }

  async deleteSubscription(id: string): Promise<void> {
    const { subscriptions } = useRecurringSubscriptionsStore.getState();
    const updatedSubscriptions = subscriptions.filter((item) => item.id !== id);

    useRecurringSubscriptionsStore.setState({
      subscriptions: updatedSubscriptions,
    });
    await AsyncStorage.setItem(
      STORAGE_KEYS.SUBSCRIPTIONS,
      JSON.stringify(updatedSubscriptions),
    );
  }
}

export const subscriptionApi = new SubscriptionApi();
