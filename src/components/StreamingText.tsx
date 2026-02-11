import React, { useEffect, useRef, useReducer, memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Markdown, {
  RenderRules,
} from "@ronradtke/react-native-markdown-display";
import { theme } from "../theme";

const markDownRules: RenderRules = {
  heading1: (node, children) => (
    <Text key={node.key} style={styles.heading1}>
      {children}
    </Text>
  ),
  heading2: (node, children) => (
    <Text key={node.key} style={styles.heading2}>
      {children}
    </Text>
  ),
  heading3: (node, children) => (
    <Text key={node.key} style={styles.heading3}>
      {children}
    </Text>
  ),
  heading4: (node, children) => (
    <Text key={node.key} style={styles.heading4}>
      {children}
    </Text>
  ),
  paragraph: (node, children) => (
    <Text key={node.key} style={styles.paragraph}>
      {children}
    </Text>
  ),
  bullet_list: (node, children) => (
    <View key={node.key} style={styles.bulletList}>
      {children}
    </View>
  ),
  code_inline: (node) => (
    <Text key={node.key} style={styles.codeInline}>
      {node.content}
    </Text>
  ),
  fence: (node) => (
    <View key={node.key} style={styles.codeBlock}>
      <Text style={styles.codeBlockText}>{node.content}</Text>
    </View>
  ),
  code_block: (node) => (
    <View key={node.key} style={styles.codeBlock}>
      <Text style={styles.codeBlockText}>{node.content}</Text>
    </View>
  ),
  strong: (node, children) => (
    <Text key={node.key} style={styles.strong}>
      {children}
    </Text>
  ),
  em: (node, children) => (
    <Text key={node.key} style={styles.em}>
      {children}
    </Text>
  ),
};

const markdownStyles = StyleSheet.create({
  body: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    lineHeight: 22,
  },
  link: {
    color: theme.colors.primary,
  },
  blockquote: {
    backgroundColor: theme.colors.glass,
    borderLeftColor: theme.colors.primary,
    borderLeftWidth: 4,
    paddingLeft: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginVertical: theme.spacing.sm,
  },
});

interface StreamingTextProps {
  text: string;
  textColor?: string;
  onComplete?: () => void;
  /** Characters to reveal per frame (higher = faster) */
  charsPerFrame?: number;
  /** Delay between frames in ms */
  frameDelay?: number;
  /** Whether streaming is enabled */
  isStreaming?: boolean;
}

/**
 * StreamingText component that reveals text character by character
 * Uses refs and requestAnimationFrame for efficient updates
 * Only triggers re-render when necessary (batched updates)
 */
const StreamingText: React.FC<StreamingTextProps> = memo(
  ({
    text,
    textColor = theme.colors.text,
    onComplete,
    charsPerFrame = 3,
    frameDelay = 16,
    isStreaming = true,
  }) => {
    const positionRef = useRef(0);
    const displayedTextRef = useRef("");
    const isCompleteRef = useRef(false);
    const frameIdRef = useRef<number | null>(null);
    const lastFrameTimeRef = useRef(0);

    const [, forceRender] = useReducer((x) => x + 1, 0);

    useEffect(() => {
      if (isCompleteRef.current) {
        return;
      }
      if (!isStreaming) {
        positionRef.current = text.length;
        displayedTextRef.current = text;
        isCompleteRef.current = true;
        // forceRender();
        onComplete?.();
        return;
      }

      positionRef.current = 0;
      displayedTextRef.current = "";
      isCompleteRef.current = false;

      const animate = (timestamp: number) => {
        if (timestamp - lastFrameTimeRef.current < frameDelay) {
          frameIdRef.current = requestAnimationFrame(animate);
          return;
        }
        lastFrameTimeRef.current = timestamp;

        if (positionRef.current >= text.length) {
          if (!isCompleteRef.current) {
            isCompleteRef.current = true;
            onComplete?.();
          }
          return;
        }

        // Advance position by charsPerFrame
        positionRef.current = Math.min(
          positionRef.current + charsPerFrame,
          text.length,
        );
        displayedTextRef.current = text.slice(0, positionRef.current);

        forceRender();

        frameIdRef.current = requestAnimationFrame(animate);
      };

      frameIdRef.current = requestAnimationFrame(animate);

      return () => {
        if (frameIdRef.current !== null) {
          cancelAnimationFrame(frameIdRef.current);
        }
      };
    }, [text, charsPerFrame, frameDelay, onComplete, isStreaming]);

    return (
      <Markdown style={markdownStyles} rules={markDownRules}>
        {displayedTextRef.current}
      </Markdown>
    );
  },
);

StreamingText.displayName = "StreamingText";

export { StreamingText };

const styles = StyleSheet.create({
  heading1: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    marginVertical: theme.spacing.md,
  },
  heading2: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    marginVertical: theme.spacing.sm,
  },
  heading3: {
    color: theme.colors.text,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    marginVertical: theme.spacing.sm,
  },
  heading4: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    marginVertical: theme.spacing.xs,
  },
  paragraph: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    lineHeight: 22,
    marginVertical: theme.spacing.xs,
  },
  listItem: {
    flexDirection: "row",
    marginVertical: theme.spacing.xs,
  },
  bulletList: {
    marginVertical: theme.spacing.sm,
  },
  codeInline: {
    backgroundColor: theme.colors.surfaceLight,
    color: theme.colors.primary,
    fontFamily: "monospace",
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  codeBlock: {
    backgroundColor: theme.colors.surfaceLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.sm,
  },
  codeBlockText: {
    color: theme.colors.text,
    fontFamily: "monospace",
    fontSize: theme.fontSize.sm,
  },
  strong: {
    color: theme.colors.text,
    fontWeight: theme.fontWeight.bold,
  },
  em: {
    color: theme.colors.text,
    fontStyle: "italic",
  },
});
