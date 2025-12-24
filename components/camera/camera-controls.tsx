import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraType, FlashMode } from 'expo-camera';

interface CameraControlsProps {
  flashMode: FlashMode;
  cameraType: CameraType;
  onToggleFlash: () => void;
  onFlipCamera: () => void;
}

export function CameraControls({
  flashMode,
  cameraType,
  onToggleFlash,
  onFlipCamera,
}: CameraControlsProps) {
  const getFlashIcon = () => {
    switch (flashMode) {
      case 'on':
        return 'flash';
      case 'off':
        return 'flash-off';
      case 'auto':
        return 'flash-outline';
      default:
        return 'flash-off';
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onToggleFlash}>
        <Ionicons name={getFlashIcon() as any} size={28} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onFlipCamera}>
        <Ionicons name="camera-reverse" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
