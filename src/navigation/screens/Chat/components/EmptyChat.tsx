import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { GlassCard } from "../../../../components";
import { styles } from "../styles";

interface EmptyChatProps {
  onSuggestionPress: (suggestion: { text: string; id: string }) => void;
}

const SUGGESTIONS = [
  { text: "How's my portfolio doing?", id: "how-portfolio" },
  { text: "Tell me about Warren Buffett", id: "warren-buffett" },
  { text: "Tips for diversification", id: "diversification" },
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
            <Text style={styles.suggestionText}>{suggestion.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
