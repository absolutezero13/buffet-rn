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
import { Asset, useApp } from "../context/AppContext";

interface AssetCardProps {
  asset: Asset;
  onDelete: () => void;
}

export function AssetCard({ asset, onDelete }: AssetCardProps) {
  const navigation = useNavigation();
  const totalValue = asset.currentPrice * asset.quantity;
  const totalCost = asset.purchasePrice * asset.quantity;
  const gainLoss = totalValue - totalCost;
  const gainLossPercent = ((gainLoss / totalCost) * 100).toFixed(2);
  const isPositive = gainLoss >= 0;
  const currency = useApp().baseCurrency;

  const getTypeLabel = () => {
    switch (asset.type) {
      case "stock":
        return "📈";
      case "etf":
        return "📊";
      case "crypto":
        return "🪙";
      case "gold":
        return "🥇";
      case "cash":
        return "💵";
      default:
        return "💎";
    }
  };

  const handlePress = () => {
    navigation.navigate("AssetDetail" as never, { assetId: asset.id } as never);
  };

  return (
    <Pressable onPress={handlePress}>
      <GlassCard effect="clear" style={styles.container} interactive>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.typeEmoji}>{getTypeLabel()}</Text>
            <View>
              <Text style={styles.symbol}>{asset.symbol.toUpperCase()}</Text>
              <Text style={styles.name}>{asset.name}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Quantity</Text>
            <Text style={styles.detailValue}>{asset.quantity}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Avg. Cost</Text>
            <Text style={styles.detailValue}>
              ${asset.purchasePrice.toFixed(2)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Current Price</Text>
            <Text style={styles.detailValue}>
              ${asset.currentPrice.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.totalLabel}>Total Value</Text>
            <Text style={styles.totalValue}>${totalValue.toFixed(2)}</Text>
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
              {isPositive ? "+" : ""}${gainLoss.toFixed(2)}
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
              {gainLossPercent}%)
            </Text>
          </View>
        </View>
      </GlassCard>
    </Pressable>
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
    fontSize: 32,
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
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.glass,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.md,
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
