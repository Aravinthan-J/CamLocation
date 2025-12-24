import { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { CameraView, CameraType, FlashMode } from 'expo-camera';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useCameraPermissions } from '@/hooks/use-camera-permissions';
import { useLocationPermissions } from '@/hooks/use-location-permissions';
import { useCurrentLocation } from '@/hooks/use-current-location';
import { captureAndSavePhoto } from '@/utils/photo-capture';
import { LocationIndicator } from '@/components/camera/location-indicator';
import { PermissionPrompt } from '@/components/camera/permission-prompt';
import { CameraControls } from '@/components/camera/camera-controls';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);

  const [facing, setFacing] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const [isCapturing, setIsCapturing] = useState(false);

  const cameraPermission = useCameraPermissions();
  const locationPermission = useLocationPermissions();
  const { location, loading: locationLoading, error: locationError } = useCurrentLocation(
    cameraPermission.isGranted
  );

  // Request permissions if needed
  const requestPermissions = async () => {
    await Promise.all([
      cameraPermission.requestPermission(),
      locationPermission.requestPermission(),
    ]);
  };

  // Handle photo capture
  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Capture photo
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      if (!photo) {
        throw new Error('Failed to capture photo');
      }

      // Save photo with location data
      await captureAndSavePhoto({
        uri: photo.uri,
        location: location,
        saveToCameraRollEnabled: true,
      });

      // Success feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Photo saved with location data!', [
        { text: 'Take Another' },
        {
          text: 'View Gallery',
          onPress: () => router.push('/(tabs)/gallery'),
        },
      ]);
    } catch (error) {
      console.error('Error capturing photo:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      let userMessage = 'Failed to save photo. Please try again.';

      if (errorMessage.includes('Failed to capture image')) {
        userMessage = 'Camera Error: Are you using Expo Go? This app requires a Development Build. Please build with "npx eas build --profile development --platform android"';
      }

      Alert.alert('Error', userMessage);
    } finally {
      setIsCapturing(false);
    }
  };

  // Toggle flash mode
  const toggleFlash = () => {
    setFlashMode((current) => {
      if (current === 'off') return 'on';
      if (current === 'on') return 'auto';
      return 'off';
    });
  };

  // Flip camera
  const flipCamera = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  // Show permission prompt if needed
  if (!cameraPermission.isGranted) {
    return (
      <PermissionPrompt
        type={!locationPermission.isGranted ? 'both' : 'camera'}
        canAskAgain={cameraPermission.canAskAgain}
        onRequestPermission={requestPermissions}
      />
    );
  }

  if (isCapturing) {
    return <LoadingSpinner message="Saving photo..." />;
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flashMode}
      >
        {/* Top bar with location and controls */}
        <View style={styles.topBar}>
          <LocationIndicator
            location={location}
            loading={locationLoading}
            error={locationError}
          />
          <CameraControls
            flashMode={flashMode}
            cameraType={facing}
            onToggleFlash={toggleFlash}
            onFlipCamera={flipCamera}
          />
        </View>

        {/* Capture button */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleCapture}
            disabled={isCapturing}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'column',
    gap: 16,
    paddingHorizontal: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
});
