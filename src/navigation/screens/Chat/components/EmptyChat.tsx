import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { GlassCard } from "../../../../components";
import { styles } from "../styles";

interface EmptyChatProps {
  onSuggestionPress: (suggestion: string) => void;
}

const SUGGESTIONS = [
  "How's my portfolio doing?",
  "Tell me about Warren Buffett",
  "Tips for diversification",
];

export function EmptyChat({ onSuggestionPress }: EmptyChatProps) {
  return (
    <View style={styles.emptyContainer}>
      <GlassCard style={styles.welcomeCard}>
        <Image source={require("../ai-icon.png")} style={styles.aiIcon} />
        <Text style={styles.welcomeTitle}>Buffet AI</Text>
        <Text style={styles.welcomeText}>
          Your intelligent investment assistant. Ask me about investing
          strategies, portfolio advice, or wisdom from legendary investors.
        </Text>
      </GlassCard>

      <View style={styles.suggestions}>
        <Text style={styles.suggestionsTitle}>Try asking:</Text>
        {SUGGESTIONS.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionButton}
            onPress={() => onSuggestionPress(suggestion)}
          >
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
