import React from "react";
import { View, Text, ImageSourcePropType } from "react-native";
import { styles } from "../styles";
import { LiquidGlassView } from "@callstack/liquid-glass";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "../../../../components";
import { theme } from "../../../../theme";
import { Image } from "expo-image";

interface AssetHeaderProps {
  symbol: string;
  image: ImageSourcePropType;
  onBack: () => void;
  onDelete: () => void;
}

export function AssetHeader({
  symbol,
  image,
  onBack,
  onDelete,
}: AssetHeaderProps) {
  const { top } = useSafeAreaInsets();
  return (
    <LiquidGlassView
      effect="clear"
      style={[styles.header, { paddingTop: top }]}
    >
      <IconButton
        icon="arrow-back"
        size="medium"
        variant="ghost"
        onPress={onBack}
      />
      <View style={styles.headerCenter}>
        <Text style={styles.symbol}>{symbol}</Text>
        <Image source={image} style={styles.assetImage} />
      </View>
      <IconButton
        icon="delete-outline"
        size="medium"
        variant="ghost"
        onPress={onDelete}
        iconColor={theme.colors.danger}
      />
    </LiquidGlassView>
  );
}
