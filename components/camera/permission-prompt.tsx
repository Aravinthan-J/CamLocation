import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

interface PermissionPromptProps {
  type: 'camera' | 'location' | 'both';
  canAskAgain: boolean;
  onRequestPermission: () => void;
}

export function PermissionPrompt({
  type,
  canAskAgain,
  onRequestPermission,
}: PermissionPromptProps) {
  const getMessage = () => {
    switch (type) {
      case 'camera':
        return 'Camera access is required to take photos.';
      case 'location':
        return 'Location access is needed to tag photos with GPS coordinates.';
      case 'both':
        return 'Camera and location access are required to capture photos with location data.';
    }
  };

  const openSettings = () => {
    Linking.openSettings();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Permission Required</Text>
      <Text style={styles.message}>{getMessage()}</Text>

      {canAskAgain ? (
        <TouchableOpacity style={styles.button} onPress={onRequestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      ) : (
        <>
          <Text style={styles.settingsHint}>
            Please enable permissions in Settings.
          </Text>
          <TouchableOpacity style={styles.button} onPress={openSettings}>
            <Text style={styles.buttonText}>Open Settings</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 8,
  },
  settingsHint: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
