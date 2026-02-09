import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  LiquidGlassView,
  isLiquidGlassSupported,
} from "@callstack/liquid-glass";
import { theme } from "../theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  glassEffect?: "clear" | "regular";
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
  glassEffect = "regular",
}: ButtonProps) {
  const getGradientColors = (): [string, string] => {
    if (disabled) return [theme.colors.surfaceLighter, theme.colors.surface];
    switch (variant) {
      case "secondary":
        return [theme.colors.secondary, theme.colors.secondaryLight];
      case "danger":
        return [theme.colors.danger, theme.colors.dangerLight];
      case "ghost":
        return ["transparent", "transparent"];
      default:
        return [theme.colors.primary, theme.colors.primaryLight];
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case "small":
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
        };
      case "large":
        return {
          paddingVertical: theme.spacing.lg,
          paddingHorizontal: theme.spacing.xl,
        };
      default:
        return {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
        };
    }
  };

  const getTextSize = (): number => {
    switch (size) {
      case "small":
        return theme.fontSize.sm;
      case "large":
        return theme.fontSize.lg;
      default:
        return theme.fontSize.md;
    }
  };

  return (
    <LiquidGlassView
      effect="clear"
      interactive
      style={[styles.container, fullWidth && styles.fullWidth, style]}
    >
      <TouchableOpacity
        disabled={disabled}
        activeOpacity={1}
        style={[
          {
            opacity: disabled ? 0.5 : 1,
            height: 50,
          },
        ]}
        onPress={onPress}
      >
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradient,
            variant === "ghost" && styles.ghost,
            getSizeStyles(),
          ]}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.text} />
          ) : (
            <Text
              style={[
                styles.text,
                { fontSize: getTextSize() },
                variant === "ghost" && styles.ghostText,
                disabled && styles.disabledText,
                textStyle,
              ]}
            >
              {title}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </LiquidGlassView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.full,
    height: 50,
  },
  fullWidth: {
    width: "100%",
  },
  gradient: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.borderRadius.full,
    height: "100%",
  },
  text: {
    color: theme.colors.text,
    fontWeight: theme.fontWeight.semibold,
  },
  ghost: {
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  ghostText: {
    color: theme.colors.textSecondary,
  },
  disabledText: {
    color: theme.colors.textMuted,
  },
});
