import { View, Text, StyleSheet } from 'react-native';

export default function CameraScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📱</Text>
      <Text style={styles.title}>Camera Not Available on Web</Text>
      <Text style={styles.message}>
        The camera feature requires a native mobile device.
      </Text>
      <Text style={styles.instruction}>
        Please use the iOS or Android app to capture photos with location data.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#000',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 12,
  },
  instruction: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
