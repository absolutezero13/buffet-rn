import { StyleSheet } from "react-native";
import { theme } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    alignItems: "center",
  },
  emoji: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  stepText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
  },
  spinner: {
    marginTop: theme.spacing.md,
  },
  progressContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 80,
    gap: theme.spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.surfaceLighter,
  },
  progressDotActive: {
    backgroundColor: theme.colors.primary,
  },
});
