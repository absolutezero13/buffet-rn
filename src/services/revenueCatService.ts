import Purchases, {
  PurchasesPackage,
  CustomerInfo,
} from "react-native-purchases";
import { Platform } from "react-native";
import useSubscriptionStore from "../store/useSubscriptionStore";

// Replace with your RevenueCat API keys
const API_KEY = Platform.select({
  ios: "appl_rkyexrakCNcyColpHhXLQPBxeXc",
  android: "YOUR_REVENUECAT_ANDROID_API_KEY",
}) as string;

const ENTITLEMENT_ID = "pro";

function updateSubscriptionStatus(customerInfo: CustomerInfo) {
  const isActive =
    typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined";
  useSubscriptionStore.getState().setIsSubscribed(isActive);
}

export const revenueCatService = {
  async initialize() {
    Purchases.configure({ apiKey: API_KEY });
    const customerInfo = await Purchases.getCustomerInfo();
    console.log("revenueCatService Customer info:", customerInfo);
    updateSubscriptionStatus(customerInfo);
  },

  async getOfferings() {
    console.log("revenueCatService Fetching offerings...");
    const offerings = await Purchases.getOfferings();
    console.log("revenueCatService Offerings:", offerings);
    return offerings.current;
  },

  async purchase(pkg: PurchasesPackage) {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    console.log("revenueCatService Purchase customer info:", customerInfo);
    return customerInfo;
  },

  async restorePurchases() {
    const customerInfo = await Purchases.restorePurchases();

    updateSubscriptionStatus(customerInfo);
    return customerInfo;
  },
};
