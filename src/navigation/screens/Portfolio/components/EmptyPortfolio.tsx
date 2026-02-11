import React from "react";
import { View, Text } from "react-native";
import { GlassCard, Button } from "../../../../components";
import { styles } from "../styles";
import { Image } from "expo-image";

interface EmptyPortfolioProps {
  onAddAsset: () => void;
}

export function EmptyPortfolio({ onAddAsset }: EmptyPortfolioProps) {
  return (
    <GlassCard style={styles.emptyCard}>
      <Image source={require("../empty-asset.png")} style={styles.emptyAsset} />
      <Text style={styles.emptyTitle}>No Assets Yet</Text>
      <Text style={styles.emptyText}>
        Start building your portfolio by adding your first asset
      </Text>
      <Button
        title="Add Your First Asset"
        onPress={onAddAsset}
        style={styles.emptyButton}
      />
    </GlassCard>
  );
}
