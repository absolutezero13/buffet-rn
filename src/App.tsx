import { Assets as NavigationAssets } from "@react-navigation/elements";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { StatusBar } from "react-native";
import { Navigation } from "./navigation";
import { theme } from "./theme";
import { assetApi } from "./services/assetApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./navigation/constants";
import useUserStore from "./store/useUserStore";
import { KeyboardProvider } from "react-native-keyboard-controller";

Asset.loadAsync([...NavigationAssets]);

SplashScreen.preventAutoHideAsync();

const initApp = async () => {
  await assetApi.getUserAssets();
  const userStore = await AsyncStorage.getItem(STORAGE_KEYS.USER);
  useUserStore.setState(
    userStore ? JSON.parse(userStore) : { hasOnboarded: false },
  );
};

export function App() {
  React.useEffect(() => {
    initApp().then(() => {
      setTimeout(() => SplashScreen.hideAsync(), 500);
    });
  }, []);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.background}
      />
      <KeyboardProvider>
        <Navigation />
      </KeyboardProvider>
    </>
  );
}
