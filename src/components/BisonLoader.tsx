import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, Easing } from "react-native";
import { theme } from "../theme";

const BISON = require("../assets/bison.png");

export function BisonLoader() {
  const tiltAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const tiltAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(tiltAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.timing(tiltAnim, {
          toValue: -1,
          duration: 1200,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.timing(tiltAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
      ]),
    );

    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.08,
          duration: 1200,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
      ]),
    );

    tiltAnimation.start();
    scaleAnimation.start();

    return () => {
      tiltAnimation.stop();
      scaleAnimation.stop();
    };
  }, [tiltAnim, scaleAnim]);

  const rotation = tiltAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-12deg", "0deg", "12deg"],
  });

  return (
    <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
      <Animated.Image
        source={BISON}
        style={[
          styles.emoji,
          {
            transform: [{ rotate: rotation }, { scale: scaleAnim }],
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.overlayLight,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  emoji: {
    width: 120,
    height: 120,
  },
});
