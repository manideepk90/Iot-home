import React, { useEffect, useRef } from "react";
import CircleContainer from "./CircleContainer";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import { Colors } from "@/constants/Colors";
const ContentricCircles = ({ children, style = {} }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      })
    );

    animation.start();
  }, [animatedValue]);
  const scaling = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1], // Adjust the scaling values as needed
  });
  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      width: 600,
      height: 310,
      paddingTop: 20,
      bottom: 0,
      borderTopLeftRadius: 600 / 2,
      borderTopRightRadius: 600 / 2,
      backgroundColor: Colors.light.primaryLight,
      transform: [{ scale: scaling }],
      transformOrigin: "bottom",
      zIndex: -1,
    },
  });

  return (
    <>
      <Animated.View style={styles.container}></Animated.View>
      <CircleContainer
        borderTopLeftRadius={400}
        borderTopRightRadius={400}
        padding={20}
        paddingBottom={0}
        delay={36}
      >
        <CircleContainer
          borderTopLeftRadius={400}
          borderTopRightRadius={400}
          delay={36}
        >
          <CircleContainer
            borderTopLeftRadius={360}
            borderTopRightRadius={360}
            delay={32}
          >
            <CircleContainer
              borderTopLeftRadius={360}
              borderTopRightRadius={360}
              delay={28}
            >
              <CircleContainer
                borderTopLeftRadius={300}
                borderTopRightRadius={300}
                delay={24}
              >
                <CircleContainer
                  borderTopLeftRadius={300}
                  borderTopRightRadius={300}
                  delay={20}
                >
                  <CircleContainer
                    borderTopLeftRadius={300}
                    borderTopRightRadius={300}
                    delay={16}
                  >
                    <CircleContainer
                      borderTopLeftRadius={300}
                      borderTopRightRadius={300}
                      delay={12}
                    >
                      <CircleContainer
                        borderTopLeftRadius={260}
                        borderTopRightRadius={260}
                        delay={8}
                      >
                        <CircleContainer
                          borderTopLeftRadius={260}
                          borderTopRightRadius={260}
                          delay={4}
                        >
                          <CircleContainer>{children}</CircleContainer>
                        </CircleContainer>
                      </CircleContainer>
                    </CircleContainer>
                  </CircleContainer>
                </CircleContainer>
              </CircleContainer>
            </CircleContainer>
          </CircleContainer>
        </CircleContainer>
      </CircleContainer>
    </>
  );
};

export default ContentricCircles;
