import React from "react";
import { Text } from "react-native";
import { styles } from "../styles";
import { LiquidGlassView } from "@callstack/liquid-glass";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "../../../../components";

interface ChatHeaderProps {
  hasMessages: boolean;
  onClear: () => void;
}

export function ChatHeader({ hasMessages, onClear }: ChatHeaderProps) {
  const { top } = useSafeAreaInsets();
  return (
    <LiquidGlassView
      effect="clear"
      style={[styles.header, { paddingTop: top }]}
    >
      <Text style={styles.title}>AI Assistant</Text>
      {hasMessages && (
        <IconButton icon="delete-outline" size="medium" variant="ghost" onPress={onClear} />
      )}
    </LiquidGlassView>
  );
}
