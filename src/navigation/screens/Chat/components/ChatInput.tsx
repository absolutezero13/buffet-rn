import React from "react";
import {
  View,
  TextInput as RNTextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../../theme";
import { styles } from "../styles";
import { useBottomTabBarHeight } from "react-native-bottom-tabs";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useKeyboardAnimation } from "react-native-keyboard-controller";
interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  isDisabled: boolean;
}

export function ChatInput({
  value,
  onChangeText,
  onSend,
  isDisabled,
}: ChatInputProps) {
  const canSend = value.trim() && !isDisabled;
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={styles.inputContainer}>
      <LinearGradient
        colors={[theme.colors.surface, theme.colors.surfaceLight]}
        style={styles.inputGradient}
      >
        <RNTextInput
          style={styles.input}
          placeholder="Ask about investing..."
          placeholderTextColor={theme.colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
          onPress={onSend}
          disabled={!canSend}
        >
          <LinearGradient
            colors={
              canSend
                ? [theme.colors.primary, theme.colors.primaryLight]
                : [theme.colors.surfaceLighter, theme.colors.surface]
            }
            style={styles.sendButtonGradient}
          >
            <Text style={styles.sendButtonText}>↑</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
      <View style={[styles.inputSafeArea, { height: tabBarHeight }]} />
    </View>
  );
}
