import { StyleSheet } from "react-native";
import { theme } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginRight: theme.spacing.md,
  },
  closeText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.xl,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  icon: {
    width: 150,
    height: 150,
  },
  emoji: {
    fontSize: 80,
    marginBottom: theme.spacing.lg,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: theme.spacing.md,
  },
  features: {
    width: "100%",
    gap: theme.spacing.md,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.glass,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  featureText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    flex: 1,
  },
  footer: {
    paddingHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.xxl,
  },
  restoreButton: {
    alignItems: "center",
    paddingVertical: theme.spacing.md,
  },
  restoreText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
  },
});
