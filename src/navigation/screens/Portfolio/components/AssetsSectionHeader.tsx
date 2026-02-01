import React from "react";
import { View, Text } from "react-native";
import { Button } from "../../../../components";
import { styles } from "../styles";

interface AssetsSectionHeaderProps {
  hasAssets: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onAddAsset: () => void;
}

export function AssetsSectionHeader({
  hasAssets,
  isRefreshing,
  onRefresh,
  onAddAsset,
}: AssetsSectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Your Assets</Text>
      <View style={styles.headerButtons}>
        {hasAssets && (
          <Button
            title={isRefreshing ? "⟳" : "↻"}
            size="small"
            variant="secondary"
            onPress={onRefresh}
            style={styles.refreshButton}
          />
        )}
        <Button title="+ Add" size="small" onPress={onAddAsset} />
      </View>
    </View>
  );
}
