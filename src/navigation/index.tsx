import React from "react";
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
    Loading: {
      screen: Loading,
    },
    Paywall: {
      screen: Paywall,
      options: {
        presentation: "modal",
        gestureEnabled: false,
      },
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
    Paywall: {
      screen: Paywall,
      options: {
        presentation: "modal",
        gestureEnabled: false,
      },
    },
  },
});

const OnboardingNavigation = createStaticNavigation(OnboardingStack);
const AppNavigation = createStaticNavigation(AppStack);

export function Navigation() {
  const { hasOnboarded, isInitialized } = useUserStore();

  if (!isInitialized) {
    return null;
  }

  if (!hasOnboarded) {
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
