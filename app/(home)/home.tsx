import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DeviceDetails from "@/components/DeviceDetails";
import DeviceSelectOption from "@/components/DeviceSelectOption";
import DeviceButtons from "@/components/DeviceButtons";
const home = () => {
  const insets = useSafeAreaInsets();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: insets.top,
      position: "relative",
      padding: 16,
      display: "flex",
    },
  });
  return (
    <View style={styles.container}>
      <DeviceSelectOption />
      <ScrollView>
        <View style={{ alignItems: "center", marginTop: 15, gap: 15 }}>
          <DeviceDetails />
          <DeviceButtons />
        </View>
      </ScrollView>
    </View>
  );
};

export default home;
