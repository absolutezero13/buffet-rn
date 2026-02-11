import React, { useState, useCallback, useEffect } from "react";
import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { theme } from "../theme";
import { Portfolio, Chat, Settings, Welcome, AssetDetail } from "./screens";
import { Loading } from "./screens/Loading";
import { Paywall } from "./screens/Paywall";
import useUserStore from "../store/useUserStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./constants";

const Tabs = createNativeBottomTabNavigator();

function MainTabs() {
  return (
    <Tabs.Navigator
      hapticFeedbackEnabled
      initialRouteName="Portfolio"
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
      }}
    >
      <Tabs.Screen
        name="Portfolio"
        component={Portfolio}
        options={{
          title: "Portfolio",
          tabBarIcon: () => ({ sfSymbol: "chart.pie.fill" }),
        }}
      />
      <Tabs.Screen
        name="Chat"
        component={Chat}
        options={{
          title: "AI Chat",
          tabBarIcon: () => ({ sfSymbol: "sparkles" }),
        }}
      />
      <Tabs.Screen
        name="Settings"
        component={Settings}
        options={{
          title: "Settings",
          tabBarIcon: () => ({ sfSymbol: "gearshape" }),
        }}
      />
    </Tabs.Navigator>
  );
}

const OnboardingStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Welcome: {
      screen: Welcome,
    },
  },
});

const AppStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    MainTabs: {
      screen: MainTabs,
    },
    AssetDetail: {
      screen: AssetDetail,
    },
  },
});

const OnboardingNavigation = createStaticNavigation(OnboardingStack);
const AppNavigation = createStaticNavigation(AppStack);

export function Navigation() {
  const { hasOnboarded, onboardingCompleted } = useUserStore();
  const [showLoading, setShowLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    if (onboardingCompleted && !hasOnboarded) {
      setShowLoading(true);
    }
  }, [onboardingCompleted, hasOnboarded]);

  const handleLoadingComplete = useCallback(() => {
    setShowLoading(false);
    setShowPaywall(true);
  }, []);

  const handlePaywallClose = useCallback(() => {
    setShowPaywall(false);
    useUserStore.setState({ hasOnboarded: true, onboardingCompleted: false });
    AsyncStorage.setItem(
      STORAGE_KEYS.USER,
      JSON.stringify({ hasOnboarded: true }),
    );
  }, []);

  if (!hasOnboarded) {
    if (showPaywall) {
      return <Paywall onClose={handlePaywallClose} />;
    }

    if (showLoading) {
      return <Loading onComplete={handleLoadingComplete} />;
    }

    return <OnboardingNavigation />;
  }

  return <AppNavigation />;
}

type AppStackParamList = StaticParamList<typeof AppStack>;
type OnboardingStackParamList = StaticParamList<typeof OnboardingStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamList {}
  }
}
