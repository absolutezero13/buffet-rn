import { Assets as NavigationAssets } from "@react-navigation/elements";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { StatusBar } from "react-native";
import { Navigation } from "./navigation";
import { theme } from "./theme";
import { assetApi } from "./services/assetApi";

Asset.loadAsync([...NavigationAssets]);

SplashScreen.preventAutoHideAsync();

const initApp = async () => {
  await assetApi.getUserAssets();
  await assetApi.getUserCurrency();
};

export function App() {
  React.useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.background}
      />
      <Navigation />
    </>
  );
}
