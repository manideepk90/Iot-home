import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
const watermark = require("../assets/images/watermark.png");
const WaterMark = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.watermark} source={watermark} />
    </View>
  );
};

export default WaterMark;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.2,
  },
  watermark: {
    width: "100%",
    maxHeight: 250,
    maxWidth: 250,
    height: "100%",
  },
});
