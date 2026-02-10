import React, { useState, useRef, useEffect } from "react";
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  Alert,
} from "react-native";
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
      }, 200);
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

  return (
    <>
      <ChatHeader hasMessages={chatMessages.length > 0} onClear={clearChat} />
      <View style={styles.container}>
        <View style={styles.chatContainer}>
          <FlatList
            ref={flatListRef}
            data={chatMessages}
            renderItem={({ item }) => <ChatMessage message={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.messageList,
              { paddingBottom: bottomTabHeight + 50 },
            ]}
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
        </View>
      </View>
    </>
  );
}
