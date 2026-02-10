import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles";
import { LiquidGlassView } from "@callstack/liquid-glass";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
        <TouchableOpacity onPress={onClear}>
          <Text style={styles.clearButton}>Clear</Text>
        </TouchableOpacity>
      )}
    </LiquidGlassView>
  );
}
