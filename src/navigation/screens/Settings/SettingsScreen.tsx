import React from "react";
import { View, Text, ScrollView, Alert, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, GlassCard } from "../../../components";
import { styles } from "./styles";
import CurrencyBottomSheet, {
  globalCurrencyBottomSheetRef,
} from "./components/CurrencyBottomSheet";
import WeightUnitBottomSheet, {
  globalWeightUnitBottomSheetRef,
} from "./components/WeightUnitBottomSheet";
import useCurrencyStore from "../../../store/useCurrencyStore";
import useWeightUnitStore from "../../../store/useWeightUnitStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../../constants";
import useUserAssets from "../../../store/useUserAssets";
import useUserStore from "../../../store/useUserStore";
import useSubscriptionStore from "../../../store/useSubscriptionStore";
import { revenueCatService } from "../../../services/revenueCatService";
import { LiquidGlassView } from "@callstack/liquid-glass";

export function Settings() {
  const { userCurrency } = useCurrencyStore();
  const { weightUnit } = useWeightUnitStore();
  const { isSubscribed } = useSubscriptionStore();

  const { top } = useSafeAreaInsets();
  const clearUser = () => {
    AsyncStorage.removeItem(STORAGE_KEYS.USER);
    AsyncStorage.removeItem(STORAGE_KEYS.ASSETS);
    useUserAssets.setState({ userAssets: [] });
    useUserStore.setState({ hasOnboarded: false, onboardingCompleted: false });
  };

  const handleRestorePurchases = async () => {
    try {
      await revenueCatService.restorePurchases();
      Alert.alert("Success", "Purchases restored successfully.");
    } catch (error) {
      Alert.alert("Error", "Could not restore purchases. Please try again.");
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "This will wipe all your data and return you to onboarding. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: clearUser,
        },
      ],
    );
  };

  return (
    <>
      <LiquidGlassView
        effect="clear"
        style={[styles.header, { paddingTop: top }]}
      >
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your preferences</Text>
      </LiquidGlassView>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <Pressable
            onPress={() => globalCurrencyBottomSheetRef.current?.present()}
          >
            <GlassCard
              interactive
              effect="clear"
              style={{
                ...styles.card,
                ...{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              }}
            >
              <Text style={styles.sectionTitle}>Default currency</Text>
              <Text style={styles.currency}>{userCurrency?.id}</Text>
            </GlassCard>
          </Pressable>

          <Pressable
            onPress={() => globalWeightUnitBottomSheetRef.current?.present()}
          >
            <GlassCard
              interactive
              effect="clear"
              style={{
                ...styles.card,
                ...{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              }}
            >
              <Text style={styles.sectionTitle}>Commodity weight unit</Text>
              <Text style={styles.currency}>{weightUnit?.fullName}</Text>
            </GlassCard>
          </Pressable>

          <GlassCard effect="clear" style={styles.card}>
            <Text style={styles.sectionTitle}>Subscription</Text>
            <Text style={styles.sectionDescription}>
              {isSubscribed
                ? "You have an active Pro subscription."
                : "Subscribe to unlock AI Chat and historical charts."}
            </Text>
            <Button
              title="Restore Purchases"
              onPress={handleRestorePurchases}
              fullWidth
            />
          </GlassCard>

          <GlassCard effect="clear" style={styles.card}>
            <Text style={styles.sectionTitle}>Manage Account</Text>
            <Text style={styles.sectionDescription}>
              Signing out will remove all saved data from this device.
            </Text>
            {/* <Button
              title="Sign Out"
              onPress={handleSignOut}
              style={styles.signOutButton}
              fullWidth
            /> */}
            <Text onPress={handleSignOut} style={styles.signOutButton}>
              Sign out
            </Text>
          </GlassCard>
        </ScrollView>
      </View>

      <CurrencyBottomSheet />
      <WeightUnitBottomSheet />
    </>
  );
}
