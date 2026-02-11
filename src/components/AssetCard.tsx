import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GlassCard } from "./GlassCard";
import { theme } from "../theme";
import { Asset } from "../services/types";
import { useCurrency } from "../hooks";
import { Image } from "expo-image";
import { getAssetTypeImage } from "../navigation/constants";

interface AssetCardProps {
  asset: Asset;
  onDelete: () => void;
}

export function AssetCard({ asset, onDelete }: AssetCardProps) {
  const {
    currencySymbol,
    getAssetCurrentValue,
    getAssetTotalCost,
    getAssetGainLoss,
    getAssetPurchasePrice,
    getAssetCurrentPrice,
  } = useCurrency();
  const navigation = useNavigation();

  const totalValue = getAssetCurrentValue(asset);
  const totalCost = getAssetTotalCost(asset);
  const { gainLoss, gainLossPercent, isPositive } = getAssetGainLoss(asset);
  const purchasePriceDisplay = getAssetPurchasePrice(asset);
  const currentPriceDisplay = getAssetCurrentPrice(asset);

  const handlePress = () => {
    navigation.navigate("AssetDetail", { assetId: asset.id } as never);
  };

  return (
    <GlassCard
      tintColor={theme.colors.surfaceLight}
      effect="clear"
      style={styles.container}
      interactive
    >
      <Pressable onPress={handlePress}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={getAssetTypeImage(asset.type)}
              style={styles.typeEmoji}
            />
            <View>
              <Text style={styles.symbol}>{asset.symbol.toUpperCase()}</Text>
              <Text style={styles.name}>{asset.name}</Text>
            </View>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Quantity</Text>
            <Text style={styles.detailValue}>{asset.quantity}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Avg. Cost</Text>
            <Text style={styles.detailValue}>
              {currencySymbol}
              {purchasePriceDisplay.toFixed(2)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Current Price</Text>
            <Text style={styles.detailValue}>
              {currencySymbol}
              {currentPriceDisplay.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.totalLabel}>Total Value</Text>
            <Text style={styles.totalValue}>
              {currencySymbol}
              {totalValue.toFixed(2)}
            </Text>
          </View>
          <View style={styles.gainLossContainer}>
            <Text
              style={[
                styles.gainLoss,
                {
                  color: isPositive
                    ? theme.colors.positive
                    : theme.colors.negative,
                },
              ]}
            >
              {isPositive ? "+" : ""}
              {currencySymbol}
              {gainLoss.toFixed(2)}
            </Text>
            <Text
              style={[
                styles.gainLossPercent,
                {
                  color: isPositive
                    ? theme.colors.positive
                    : theme.colors.negative,
                },
              ]}
            >
              ({isPositive ? "+" : ""}
              {gainLossPercent.toFixed(2)}%)
            </Text>
          </View>
        </View>
      </Pressable>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeEmoji: {
    width: 32,
    height: 32,
    marginRight: theme.spacing.md,
  },
  symbol: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
  },
  name: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },

  details: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.glassBorder,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xs,
  },
  detailLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
  },
  detailValue: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  totalLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
  },
  totalValue: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
  },
  gainLossContainer: {
    alignItems: "flex-end",
  },
  gainLoss: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  gainLossPercent: {
    fontSize: theme.fontSize.sm,
  },
});
