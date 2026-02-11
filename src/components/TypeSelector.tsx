import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { theme } from "../theme";
import Animated, { LinearTransition } from "react-native-reanimated";

interface TypeSelectorProps {
  selected: string;
  onSelect: (type: string) => void;
}

const types = [
  { id: "stock", label: "Stock & ETF", emoji: "📈" },
  { id: "crypto", label: "Crypto", emoji: "🪙" },
  { id: "gold", label: "Commodities", emoji: "🥇" },
  { id: "cash", label: "Cash", emoji: "💵" },
];

export function TypeSelector({ selected, onSelect }: TypeSelectorProps) {
  return (
    <Animated.View layout={LinearTransition} style={styles.container}>
      <Text style={styles.label}>Asset Type</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
      >
        {types.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeButton,
              selected === type.id && styles.typeButtonActive,
            ]}
            onPress={() => onSelect(type.id)}
          >
            <Text style={styles.typeEmoji}>{type.emoji}</Text>
            <Text
              style={[
                styles.typeLabel,
                selected === type.id && styles.typeLabelActive,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.sm,
    fontWeight: theme.fontWeight.medium,
  },
  scroll: {
    flexDirection: "row",
  },
  typeButton: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginRight: theme.spacing.sm,
  },
  typeButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.glass,
  },
  typeEmoji: {
    fontSize: 24,
    marginBottom: theme.spacing.xs,
  },
  typeLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
  },
  typeLabelActive: {
    color: theme.colors.primary,
  },
});
