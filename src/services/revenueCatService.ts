import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  PURCHASES_ERROR_CODE,
} from "react-native-purchases";
import { Platform } from "react-native";
import useSubscriptionStore from "../store/useSubscriptionStore";

// Replace with your RevenueCat API keys
const API_KEY = Platform.select({
  ios: "appl_rkyexrakCNcyColpHhXLQPBxeXc",
  android: "YOUR_REVENUECAT_ANDROID_API_KEY",
}) as string;

const ENTITLEMENT_ID = "Buffet AI Pro";

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
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      console.log("revenueCatService Purchase customer info:", customerInfo);
      updateSubscriptionStatus(customerInfo);
      return customerInfo;
    } catch (error: any) {
      // Check if user is already subscribed
      if (error.code === PURCHASES_ERROR_CODE.PRODUCT_ALREADY_PURCHASED_ERROR) {
        console.log(
          "revenueCatService User is already subscribed, updating state",
        );
        const customerInfo = await Purchases.getCustomerInfo();
        updateSubscriptionStatus(customerInfo);
        return customerInfo;
      }

      console.error("RevenueCat purchase error:", error);
    }
  },

  async restorePurchases() {
    const customerInfo = await Purchases.restorePurchases();

    updateSubscriptionStatus(customerInfo);
    return customerInfo;
  },
};
