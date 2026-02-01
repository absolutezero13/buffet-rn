import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { theme } from "../../../../theme";
import { styles } from "../styles";

export function TypingIndicator() {
  return (
    <View style={styles.typingIndicator}>
      <ActivityIndicator size="small" color={theme.colors.primary} />
      <Text style={styles.typingText}>Buffet AI is thinking...</Text>
    </View>
  );
}
