import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { PurchasesPackage } from "react-native-purchases";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../../../theme";
import { Button, IconButton } from "../../../components";
import { revenueCatService } from "../../../services/revenueCatService";
import { STORAGE_KEYS } from "../../constants";
import useUserStore from "../../../store/useUserStore";
import { styles } from "./styles";
import { Image } from "expo-image";

const FEATURES = [
  {
    emoji: require("../../../assets/bison.png"),
    text: "AI-powered financial chatbot",
  },
  {
    emoji: require("../../../assets/chart.png"),
    text: "Historical price charts",
  },
  {
    emoji: require("../../../assets/bulb.png"),
    text: "Personalized investment insights",
  },
  {
    emoji: require("../../../assets/infinity.png"),
    text: "Unlimited portfolio tracking",
  },
];

export function Paywall() {
  const [pkg, setPkg] = useState<PurchasesPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const navigation = useNavigation();
  const { hasOnboarded } = useUserStore();
  useEffect(() => {
    loadOfferings();
  }, []);

  const handleClose = () => {
    if (!hasOnboarded) {
      // During onboarding flow: mark as onboarded
      useUserStore.setState({ hasOnboarded: true, onboardingCompleted: false });
      AsyncStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify({ hasOnboarded: true }),
      );
    } else {
      // In-app: just go back
      navigation.goBack();
    }
  };

  const loadOfferings = async () => {
    try {
      const offering = await revenueCatService.getOfferings();
      if (offering?.availablePackages.length) {
        setPkg(offering.availablePackages[0]);
      }
    } catch (error) {
      console.error("Error loading offerings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!pkg) return;

    setIsPurchasing(true);
    try {
      await revenueCatService.purchase(pkg);
      handleClose();
    } catch (error: any) {
      if (!error.userCancelled) {
        Alert.alert("Error", "Purchase failed. Please try again.");
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsPurchasing(true);
    try {
      await revenueCatService.restorePurchases();
      handleClose();
    } catch (error) {
      Alert.alert("Error", "Could not restore purchases. Please try again.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const priceText = pkg?.product.priceString
    ? `Subscribe for ${pkg.product.priceString}/month`
    : "Subscribe";

  return (
    <>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.gradient}
      />

      <View style={styles.safeArea}>
        <IconButton
          icon="close"
          onPress={handleClose}
          style={{ ...styles.closeButton, position: "absolute", top: 15 }}
          size="small"
        />

        <View style={styles.content}>
          <Image source={require("../Chat/ai-icon.png")} style={styles.icon} />
          <Text style={styles.title}>Buffet AI Pro</Text>
          <Text style={styles.subtitle}>
            Unlock the full power of your investment companion
          </Text>

          <View style={styles.features}>
            {FEATURES.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Image source={feature.emoji} style={styles.featureEmoji} />
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <>
              <Button
                title={isPurchasing ? "Processing..." : priceText}
                onPress={handlePurchase}
                disabled={isPurchasing || !pkg}
                loading={isPurchasing}
                fullWidth
              />

              <TouchableOpacity
                style={styles.restoreButton}
                onPress={handleRestore}
                disabled={isPurchasing}
              >
                <Text style={styles.restoreText}>Restore Purchases</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </>
  );
}
