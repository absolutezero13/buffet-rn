import React from "react";
import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useApp } from "../context/AppContext";
import { theme } from "../theme";
import { Portfolio, Chat, Welcome, AssetDetail } from "./screens";

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
  const { hasOnboarded } = useApp();

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
