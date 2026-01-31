import { Assets as NavigationAssets } from "@react-navigation/elements";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { StatusBar } from "react-native";
import { Navigation } from "./navigation";
import { AppProvider } from "./context/AppContext";
import { theme } from "./theme";

Asset.loadAsync([...NavigationAssets]);

SplashScreen.preventAutoHideAsync();

export function App() {
  React.useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AppProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.background}
      />
      <Navigation />
    </AppProvider>
  );
}
