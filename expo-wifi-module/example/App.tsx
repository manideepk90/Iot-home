import { StyleSheet, Text, View } from 'react-native';

import * as ExpoWifiModule from 'expo-wifi-module';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ExpoWifiModule.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
