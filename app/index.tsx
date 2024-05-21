import { Text, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import WaterMark from "@/components/WaterMark";
import MainTitle from "@/components/MainTitle";
import DeviceDiscovery from "@/components/DeviceDiscovery";

const index = () => {
  const insets = useSafeAreaInsets();
  return (
    <>
      <View style={{ flex: 1, paddingTop: insets.top, position: "relative" }}>
        <WaterMark />
        <View className="p-10">
          <MainTitle>Select Devices</MainTitle>
        </View>
        <DeviceDiscovery />
      </View>
      <StatusBar style="light" />
    </>
  );
};

export default index;
