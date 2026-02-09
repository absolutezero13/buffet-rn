import Purchases, {
  PurchasesPackage,
  CustomerInfo,
} from "react-native-purchases";
import { Platform } from "react-native";
import useSubscriptionStore from "../store/useSubscriptionStore";

const API_KEY = Platform.select({
  ios: "YOUR_REVENUECAT_IOS_API_KEY",
  android: "YOUR_REVENUECAT_ANDROID_API_KEY",
}) as string;

const ENTITLEMENT_ID = "pro";
const PRODUCT_ID = "buffet.monthly";

function updateSubscriptionStatus(customerInfo: CustomerInfo) {
  const isActive =
    typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined";
  useSubscriptionStore.getState().setIsSubscribed(isActive);
}

export const revenueCatService = {
  async initialize() {
    Purchases.configure({ apiKey: API_KEY });
    const customerInfo = await Purchases.getCustomerInfo();
    updateSubscriptionStatus(customerInfo);
  },

  async getOfferings() {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  },

  async purchase(pkg: PurchasesPackage) {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    updateSubscriptionStatus(customerInfo);
    return customerInfo;
  },

  async restorePurchases() {
    const customerInfo = await Purchases.restorePurchases();
    updateSubscriptionStatus(customerInfo);
    return customerInfo;
  },
};
