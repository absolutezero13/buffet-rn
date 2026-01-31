import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput as RNTextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../theme";
import { useApp } from "../../context/AppContext";
import { ChatMessage, GlassCard } from "../../components";
import { LinearGradient } from "expo-linear-gradient";

const AI_RESPONSES = [
  "Based on Warren Buffett's principles, focus on companies with strong fundamentals and competitive advantages.",
  "Diversification is key. Consider spreading your investments across different asset classes.",
  "Remember: 'Be fearful when others are greedy, and greedy when others are fearful.' - Warren Buffett",
  "Long-term investing typically outperforms short-term trading. Patience is a virtue in investing.",
  "Always do your own research before making investment decisions. Past performance doesn't guarantee future results.",
  "Consider your risk tolerance and investment timeline when building your portfolio.",
  "Dollar-cost averaging can help reduce the impact of market volatility on your investments.",
  "Keep an emergency fund before investing. Financial stability comes first.",
];

export function Chat() {
  const {
    chatMessages,
    addChatMessage,
    clearChat,
    assets,
    totalValue,
    totalGainLoss,
  } = useApp();
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (chatMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatMessages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (
      lowerMessage.includes("portfolio") ||
      lowerMessage.includes("holdings")
    ) {
      if (assets.length === 0) {
        return "You don't have any assets in your portfolio yet. Head to the Portfolio tab to add your first investment!";
      }
      const gainLossText =
        totalGainLoss >= 0
          ? `up $${totalGainLoss.toFixed(2)}`
          : `down $${Math.abs(totalGainLoss).toFixed(2)}`;
      return `Your portfolio is currently worth $${totalValue.toFixed(2)} and you're ${gainLossText}. You have ${assets.length} asset(s). Keep up the good work tracking your investments!`;
    }

    if (lowerMessage.includes("buffett") || lowerMessage.includes("warren")) {
      return "Warren Buffett, the Oracle of Omaha, emphasizes buying quality businesses at fair prices and holding them for the long term. His key principles include understanding what you invest in, maintaining a margin of safety, and being patient.";
    }

    if (lowerMessage.includes("stock") || lowerMessage.includes("buy")) {
      return "When considering stocks, look for companies with strong competitive advantages (moats), consistent earnings growth, competent management, and reasonable valuations. Always invest within your circle of competence.";
    }

    if (lowerMessage.includes("crypto") || lowerMessage.includes("bitcoin")) {
      return "Cryptocurrency is a highly volatile asset class. If you choose to invest, only allocate what you can afford to lose. Many traditional investors recommend limiting crypto to 5-10% of your portfolio.";
    }

    if (lowerMessage.includes("diversif")) {
      return "Diversification helps reduce risk by spreading investments across different asset classes, sectors, and geographies. However, over-diversification can dilute returns. Find the right balance for your risk tolerance.";
    }

    if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hey")
    ) {
      return "Hello! I'm Buffet AI, your investment companion. I can help you understand investment principles, discuss your portfolio, or share wisdom from legendary investors. What would you like to know?";
    }

    return AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    addChatMessage({ role: "user", content: inputText.trim() });
    setInputText("");
    setIsTyping(true);

    setTimeout(
      () => {
        const response = generateAIResponse(inputText);
        addChatMessage({ role: "assistant", content: response });
        setIsTyping(false);
      },
      1000 + Math.random() * 1000,
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <GlassCard style={styles.welcomeCard}>
        <Text style={styles.welcomeEmoji}>🤖</Text>
        <Text style={styles.welcomeTitle}>Buffet AI</Text>
        <Text style={styles.welcomeText}>
          Your intelligent investment assistant. Ask me about investing
          strategies, portfolio advice, or wisdom from legendary investors.
        </Text>
      </GlassCard>

      <View style={styles.suggestions}>
        <Text style={styles.suggestionsTitle}>Try asking:</Text>
        {[
          "How's my portfolio doing?",
          "Tell me about Warren Buffett",
          "Tips for diversification",
        ].map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionButton}
            onPress={() => {
              setInputText(suggestion);
            }}
          >
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Assistant</Text>
        {chatMessages.length > 0 && (
          <TouchableOpacity onPress={clearChat}>
            <Text style={styles.clearButton}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={100}
      >
        <FlatList
          ref={flatListRef}
          data={chatMessages}
          renderItem={({ item }) => <ChatMessage message={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />

        {isTyping && (
          <View style={styles.typingIndicator}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.typingText}>Buffet AI is thinking...</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <LinearGradient
            colors={[theme.colors.surface, theme.colors.surfaceLight]}
            style={styles.inputGradient}
          >
            <RNTextInput
              style={styles.input}
              placeholder="Ask about investing..."
              placeholderTextColor={theme.colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !inputText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!inputText.trim() || isTyping}
            >
              <LinearGradient
                colors={
                  inputText.trim()
                    ? [theme.colors.primary, theme.colors.primaryLight]
                    : [theme.colors.surfaceLighter, theme.colors.surface]
                }
                style={styles.sendButtonGradient}
              >
                <Text style={styles.sendButtonText}>↑</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
          <View style={styles.inputSafeArea} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
  },
  clearButton: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.md,
  },
  chatContainer: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    paddingTop: theme.spacing.xxl,
  },
  welcomeCard: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  welcomeEmoji: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  welcomeTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing.sm,
  },
  welcomeText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: theme.spacing.md,
  },
  suggestions: {
    marginTop: theme.spacing.md,
  },
  suggestionsTitle: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.sm,
  },
  suggestionButton: {
    backgroundColor: theme.colors.glass,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  suggestionText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  typingText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    marginLeft: theme.spacing.sm,
  },
  inputContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  inputGradient: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    padding: theme.spacing.xs,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
  },
  inputSafeArea: {
    height: 34,
  },
});
