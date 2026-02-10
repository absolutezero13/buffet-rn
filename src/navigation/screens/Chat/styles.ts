import { StyleSheet } from "react-native";
import { theme } from "../../../theme";

export const CHAT_HEADER_HEIGHT = 120;
export const styles = StyleSheet.create({
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
    position: "absolute",
    width: "100%",
    zIndex: 10,
    borderBottomEndRadius: theme.borderRadius.xxl,
    borderBottomStartRadius: theme.borderRadius.xxl,
    top: 0,
    height: CHAT_HEADER_HEIGHT,
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
    paddingTop: CHAT_HEADER_HEIGHT + theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
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
    position: "absolute",
    bottom: 0,
    width: "100%",
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
