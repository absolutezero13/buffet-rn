import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { PurchasesPackage } from "react-native-purchases";
import { theme } from "../../../theme";
import { Button } from "../../../components";
import { revenueCatService } from "../../../services/revenueCatService";
import { styles } from "./styles";

const FEATURES = [
  { emoji: "🤖", text: "AI-powered financial chatbot" },
  { emoji: "📈", text: "Historical price charts" },
  { emoji: "💡", text: "Personalized investment insights" },
  { emoji: "♾️", text: "Unlimited portfolio tracking" },
];

interface PaywallProps {
  onClose: () => void;
}

export function Paywall({ onClose }: PaywallProps) {
  const [pkg, setPkg] = useState<PurchasesPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    loadOfferings();
  }, []);

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
      onClose();
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
      onClose();
    } catch (error) {
      Alert.alert("Error", "Could not restore purchases. Please try again.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const priceText = pkg?.product.priceString
    ? `${pkg.product.priceString}/month`
    : "Subscribe";

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.gradient}
      />

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.emoji}>🦬</Text>
          <Text style={styles.title}>Buffet AI Pro</Text>
          <Text style={styles.subtitle}>
            Unlock the full power of your investment companion
          </Text>

          <View style={styles.features}>
            {FEATURES.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Text style={styles.featureEmoji}>{feature.emoji}</Text>
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
                size="large"
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
      </SafeAreaView>
    </View>
  );
}
