import React, { useState, useRef, useEffect, useCallback } from "react";
import { View, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatMessage, ChatMessageType } from "../../../components";
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
import Animated from "react-native-reanimated";

export function Chat() {
  const [chatMessages, setChatMessages] = useState<
    (ChatMessageType & { isStreaming?: boolean })[]
  >([]);
  const [chatHistory, setChatHistory] = useState<GeminiMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const bottomTabHeight = useBottomTabBarHeight();
  useEffect(() => {
    if (chatMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [chatMessages]);

  const handleStreamingComplete = useCallback((messageId: string) => {
    setChatMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isStreaming: false } : msg
      )
    );
  }, []);

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
        { id: assistantMessageId, role: "assistant", content: reply, isStreaming: true },
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
          isStreaming: false,
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

  const renderMessage = useCallback(
    ({ item }: { item: ChatMessageType & { isStreaming?: boolean } }) => (
      <ChatMessage
        message={item}
        onStreamingComplete={() => handleStreamingComplete(item.id)}
      />
    ),
    [handleStreamingComplete]
  );

  return (
    <>
      <ChatHeader hasMessages={chatMessages.length > 0} onClear={clearChat} />
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.container}
        keyboardVerticalOffset={-bottomTabHeight}
      >
        <View style={styles.chatContainer}>
          <FlatList
            ref={flatListRef}
            data={chatMessages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.messageList, { paddingBottom: 0 }]}
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
      </KeyboardAvoidingView>
    </>
  );
}
