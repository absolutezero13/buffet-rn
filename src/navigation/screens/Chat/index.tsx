import React, { useState, useRef, useEffect } from "react";
import { View, FlatList, KeyboardAvoidingView, Platform, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatMessage, Button } from "../../../components";
import {
  ChatHeader,
  EmptyChat,
  TypingIndicator,
  ChatInput,
} from "./components";
import { styles } from "./styles";
import {
  chatApi,
  ChatMessage as GeminiMessage,
} from "../../../services/chatApi";
import { useBottomTabBarHeight } from "react-native-bottom-tabs";
import useSubscriptionStore from "../../../store/useSubscriptionStore";
import { revenueCatService } from "../../../services/revenueCatService";

export function Chat() {
  const [chatMessages, setChatMessages] = useState<
    { id: string; role: "user" | "assistant"; content: string }[]
  >([]);
  const [chatHistory, setChatHistory] = useState<GeminiMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const bottomTabHeight = useBottomTabBarHeight();
  const { isSubscribed } = useSubscriptionStore();
  useEffect(() => {
    if (chatMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatMessages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    const userMessageId = Date.now().toString();

    setChatMessages((prev) => [
      ...prev,
      { id: userMessageId, role: "user", content: userMessage },
    ]);

    setInputText("");
    setIsTyping(true);

    try {
      const reply = await chatApi.sendMessage(userMessage, chatHistory);

      const assistantMessageId = (Date.now() + 1).toString();
      setChatMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: "assistant", content: reply },
      ]);

      // Update history for next request
      setChatHistory((prev) => [
        ...prev,
        { role: "user", parts: [{ text: userMessage }] },
        { role: "model", parts: [{ text: reply }] },
      ]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessageId = (Date.now() + 1).toString();
      setChatMessages((prev) => [
        ...prev,
        {
          id: errorMessageId,
          role: "assistant",
          content: "Sorry, I couldn't process your request. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
  };

  const clearChat = () => {
    setChatMessages([]);
    setChatHistory([]);
  };

  const handleSubscribe = async () => {
    try {
      const offering = await revenueCatService.getOfferings();
      if (offering?.availablePackages.length) {
        await revenueCatService.purchase(offering.availablePackages[0]);
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        Alert.alert("Error", "Purchase failed. Please try again.");
      }
    }
  };

  if (!isSubscribed) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ChatHeader hasMessages={false} onClear={clearChat} />
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedEmoji}>🔒</Text>
          <Text style={styles.lockedTitle}>AI Chat is a Pro Feature</Text>
          <Text style={styles.lockedText}>
            Subscribe to Buffet AI Pro to unlock the AI chatbot and get
            personalized investment advice.
          </Text>
          <Button
            title="Subscribe to Pro"
            onPress={handleSubscribe}
            fullWidth
            size="large"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ChatHeader hasMessages={chatMessages.length > 0} onClear={clearChat} />

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={-bottomTabHeight}
      >
        <FlatList
          ref={flatListRef}
          data={chatMessages}
          renderItem={({ item }) => <ChatMessage message={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          ListEmptyComponent={
            <EmptyChat onSuggestionPress={handleSuggestionPress} />
          }
          showsVerticalScrollIndicator={false}
        />

        {isTyping && <TypingIndicator />}

        <ChatInput
          value={inputText}
          onChangeText={setInputText}
          onSend={handleSend}
          isDisabled={isTyping}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
