import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { CoolerIcon } from "@/constants/icons";
import { Image } from "expo-image";

const PushButton = ({
  onAction,
  buttonText = "button text",
  icon = CoolerIcon,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onAction && onAction();
      }}
    >
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={icon} />
        </View>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default PushButton;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.background,
    padding: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "ElMessiri-Regular",
  },
});
