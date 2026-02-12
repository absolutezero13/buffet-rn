import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { theme } from "../../../../theme";
import { Button } from "../../../../components";

interface ChatPaywallOverlayProps {
  onPress: () => void;
}

export function ChatPaywallOverlay({ onPress }: ChatPaywallOverlayProps) {
  return (
    <Pressable style={overlayStyles.container} onPress={onPress}>
      <LinearGradient
        colors={[
          "transparent",
          "rgba(5, 10, 20, 0.6)",
          "rgba(5, 10, 20, 0.85)",
          "rgba(5, 10, 20, 0.95)",
        ]}
        locations={[0, 0.3, 0.6, 1]}
        style={overlayStyles.gradient}
      />
      <View style={overlayStyles.content}>
        <Image
          source={require("../../../../assets/lock.png")}
          style={overlayStyles.lockIcon}
        />
        <Text style={overlayStyles.title}>Unlock AI Chat</Text>
        <Text style={overlayStyles.subtitle}>
          Subscribe to Buffet AI Pro to chat with your investment assistant
        </Text>
        <Button title="Subscribe Now" onPress={onPress} />
      </View>
    </Pressable>
  );
}

const overlayStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    zIndex: 100,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl * 2,
  },
  lockIcon: {
    width: 64,
    height: 64,
    marginBottom: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
});
