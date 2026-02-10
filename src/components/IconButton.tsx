import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import {
  LiquidGlassView,
  isLiquidGlassSupported,
} from "@callstack/liquid-glass";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../theme";

type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

interface IconButtonProps {
  icon: MaterialIconName;
  onPress: () => void;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  style?: ViewStyle;
  iconColor?: string;
}

const SIZES = {
  small: { button: 44, icon: 20 },
  medium: { button: 52, icon: 24 },
  large: { button: 60, icon: 26 },
};

export function IconButton({
  icon,
  onPress,
  size = "medium",
  variant = "ghost",
  disabled = false,
  style,
  iconColor,
}: IconButtonProps) {
  const dimensions = SIZES[size];

  const getIconColor = () => {
    if (iconColor) return iconColor;
    if (disabled) return theme.colors.textMuted;
    switch (variant) {
      case "primary":
        return theme.colors.text;
      case "secondary":
        return theme.colors.text;
      case "danger":
        return theme.colors.text;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getGradientColors = (): [string, string] => {
    if (disabled) return [theme.colors.surfaceLighter, theme.colors.surface];
    switch (variant) {
      case "primary":
        return [theme.colors.primary, theme.colors.primaryLight];
      case "secondary":
        return [theme.colors.secondary, theme.colors.secondaryLight];
      case "danger":
        return [theme.colors.danger, theme.colors.dangerLight];
      default:
        return ["transparent", "transparent"];
    }
  };

  const buttonContent = (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.touchable,
        {
          width: dimensions.button,
          height: dimensions.button,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          variant === "ghost" && styles.ghost,
          {
            width: dimensions.button,
            height: dimensions.button,
            borderRadius: dimensions.button / 2,
          },
        ]}
      >
        <MaterialIcons
          name={icon}
          size={dimensions.icon}
          color={getIconColor()}
        />
      </LinearGradient>
    </TouchableOpacity>
  );

  if (isLiquidGlassSupported) {
    return (
      <LiquidGlassView
        effect="clear"
        interactive
        style={[
          styles.container,
          {
            width: dimensions.button,
            height: dimensions.button,
            borderRadius: dimensions.button / 2,
          },
          style,
        ]}
      >
        {buttonContent}
      </LiquidGlassView>
    );
  }

  return (
    <LinearGradient
      colors={["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.02)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.fallbackContainer,
        {
          width: dimensions.button,
          height: dimensions.button,
          borderRadius: dimensions.button / 2,
        },
        style,
      ]}
    >
      {buttonContent}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {},
  fallbackContainer: {
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    overflow: "hidden",
  },
  touchable: {
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: {
    alignItems: "center",
    justifyContent: "center",
  },
  ghost: {
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
});
