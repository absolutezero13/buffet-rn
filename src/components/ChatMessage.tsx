import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme";
import { ChatMessage as ChatMessageType } from "../context/AppContext";
import { GlassCard } from "./GlassCard";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <View style={[styles.container, isUser && styles.containerUser]}>
      {isUser ? (
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{message.content}</Text>
        </View>
      ) : (
        <GlassCard style={styles.assistantCard} effect="clear">
          <View style={styles.assistantHeader}>
            <Text style={styles.assistantLabel}>🤖 Buffet AI</Text>
          </View>
          <Text style={styles.assistantText}>{message.content}</Text>
        </GlassCard>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    maxWidth: "85%",
  },
  containerUser: {
    alignSelf: "flex-end",
  },
  userBubble: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.spacing.xs,
    padding: theme.spacing.md,
  },
  userText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
  },
  assistantCard: {
    borderBottomLeftRadius: theme.spacing.xs,
  },
  assistantHeader: {
    marginBottom: theme.spacing.sm,
  },
  assistantLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.xs,
  },
  assistantText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    lineHeight: 22,
  },
});
