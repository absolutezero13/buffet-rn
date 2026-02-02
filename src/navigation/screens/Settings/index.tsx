import React from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../../../context/AppContext";
import { Button, GlassCard } from "../../../components";
import { styles } from "./styles.ts";

const currencyOptions: Array<"USD" | "EUR" | "GBP"> = ["USD", "EUR", "GBP"];

export function Settings() {
  const { baseCurrency, setBaseCurrency, resetApp } = useApp();

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "This will wipe all your data and return you to onboarding. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => {
            resetApp();
          },
        },
      ],
    );
  };

  return (
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

        <GlassCard effect="clear" style={styles.card}>
          <Text style={styles.sectionTitle}>Default currency</Text>
          <View style={styles.currencyOptions}>
            {currencyOptions.map((option) => {
              const isActive = option === baseCurrency;
              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.currencyOption,
                    isActive && styles.currencyOptionActive,
                  ]}
                  onPress={() => setBaseCurrency(option)}
                >
                  <Text
                    style={[
                      styles.currencyOptionText,
                      isActive && styles.currencyOptionTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </GlassCard>

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
  );
}
