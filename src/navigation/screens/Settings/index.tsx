import React from "react";
import { View, Text, ScrollView, Alert, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, GlassCard } from "../../../components";
import { styles } from "./styles";
import CurrencyBottomSheet, {
  globalCurrencyBottomSheetRef,
} from "./components/CurrencyBottomSheet";
import useCurrencyStore from "../../../store/useCurrencyStore";

export function Settings() {
  const { userCurrency } = useCurrencyStore();

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "This will wipe all your data and return you to onboarding. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => {},
        },
      ],
    );
  };

  return (
    <>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Manage your preferences</Text>
          </View>

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

          <GlassCard effect="clear" style={styles.card}>
            <Text style={styles.sectionTitle}>Account</Text>
            <Text style={styles.sectionDescription}>
              Signing out will remove all saved data from this device.
            </Text>
            <Button
              title="Sign Out"
              variant="danger"
              onPress={handleSignOut}
              style={styles.signOutButton}
              fullWidth
            />
          </GlassCard>
        </ScrollView>
      </SafeAreaView>

      <CurrencyBottomSheet />
    </>
  );
}
