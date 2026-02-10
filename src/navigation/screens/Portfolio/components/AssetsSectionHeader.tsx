import React from "react";
import { View, Text } from "react-native";
import { IconButton } from "../../../../components";
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
          <IconButton
            icon="refresh"
            size="small"
            variant="secondary"
            onPress={onRefresh}
            disabled={isRefreshing}
          />
        )}
        <IconButton
          icon="add"
          size="small"
          variant="primary"
          onPress={onAddAsset}
        />
      </View>
    </View>
  );
}
