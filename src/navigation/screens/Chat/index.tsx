import React, { useState, useRef, useEffect } from "react";
import { View, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../../../context/AppContext";
import { ChatMessage } from "../../../components";
import {
  ChatHeader,
  EmptyChat,
  TypingIndicator,
  ChatInput,
} from "./components";
import { generateAIResponse } from "./utils";
import { styles } from "./styles";

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

  const handleSend = () => {
    if (!inputText.trim()) return;

    addChatMessage({ role: "user", content: inputText.trim() });
    const messageToProcess = inputText;
    setInputText("");
    setIsTyping(true);

    setTimeout(
      () => {
        const response = generateAIResponse(messageToProcess, {
          assets,
          totalValue,
          totalGainLoss,
        });
        addChatMessage({ role: "assistant", content: response });
        setIsTyping(false);
      },
      1000 + Math.random() * 1000,
    );
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ChatHeader hasMessages={chatMessages.length > 0} onClear={clearChat} />

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
