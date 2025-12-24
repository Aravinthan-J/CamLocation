import { useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Text,
  Image,
  Modal,
} from "react-native";
import { CameraView, CameraType, FlashMode } from "expo-camera";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useCameraPermissions } from "@/hooks/use-camera-permissions";
import { useLocationPermissions } from "@/hooks/use-location-permissions";
import { useCurrentLocation } from "@/hooks/use-current-location";
import { captureAndSavePhoto } from "@/utils/photo-capture";
import { LocationIndicator } from "@/components/camera/location-indicator";
import { PermissionPrompt } from "@/components/camera/permission-prompt";
import { CameraControls } from "@/components/camera/camera-controls";

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);

  const [facing, setFacing] = useState<CameraType>("back");
  const [flashMode, setFlashMode] = useState<FlashMode>("off");
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const cameraPermission = useCameraPermissions();
  const locationPermission = useLocationPermissions();
  const {
    location,
    loading: locationLoading,
    error: locationError,
  } = useCurrentLocation(cameraPermission.isGranted);

  // Request permissions if needed
  const requestPermissions = async () => {
    await Promise.all([
      cameraPermission.requestPermission(),
      locationPermission.requestPermission(),
    ]);
  };

  // Handle camera ready event
  const handleCameraReady = useCallback(() => {
    console.log("Camera is ready");
    setIsCameraReady(true);
  }, []);

  // Handle camera mount error
  const handleMountError = useCallback((error: any) => {
    console.error("Camera mount error:", error);
    Alert.alert(
      "Camera Error",
      "Failed to initialize camera. Please restart the app.",
      [{ text: "OK" }]
    );
  }, []);

  // Handle photo capture
  const handleCapture = useCallback(async () => {
    console.log("handleCapture called", {
      hasRef: !!cameraRef.current,
      isCapturing,
      isCameraReady,
    });

    if (isCapturing) {
      console.log("Already capturing, returning");
      return;
    }

    if (!isCameraReady) {
      console.log("Camera not ready");
      Alert.alert(
        "Camera Not Ready",
        "Please wait for the camera to initialize.",
        [{ text: "OK" }]
      );
      return;
    }

    if (!cameraRef.current) {
      console.log("Camera ref is null!");
      Alert.alert("Camera Error", "Camera reference lost. Please try again.", [
        { text: "OK" },
      ]);
      return;
    }

    console.log("handleCapture starting...");

    const camera = cameraRef.current;

    try {
      setIsCapturing(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      await new Promise((resolve) => setTimeout(resolve, 100));

      console.log("Taking picture...");

      if (!camera) {
        throw new Error("Camera reference was lost during capture");
      }

      const photo = await camera.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: true,
        skipProcessing: false,
      });

      console.log("Photo captured:", photo?.uri);

      if (!photo || !photo.uri) {
        throw new Error("Failed to capture photo - no photo returned");
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Show preview instead of saving immediately
      setCapturedPhoto(photo.uri);
    } catch (error) {
      console.error("Error capturing photo:", error);

      if (error && typeof error === "object") {
        console.error("Error code:", (error as any).code);
        console.error("Error message:", (error as any).message);
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      const errorCode = (error as any)?.code;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      let userMessage = "Failed to capture photo. Please try again.";

      if (errorMessage.includes("null")) {
        userMessage = "Camera was unmounted. Please restart the camera.";
      } else if (errorCode === "ERR_IMAGE_CAPTURE_FAILED") {
        userMessage =
          "Camera capture failed. Try closing and reopening the camera.";
      } else if (errorCode === "ERR_CAMERA_NOT_READY") {
        userMessage =
          "Camera is not ready. Please wait a moment and try again.";
        setIsCameraReady(false);
      } else if (!cameraPermission.isGranted) {
        userMessage =
          "Camera permission not granted. Please grant camera access in Settings.";
      } else {
        userMessage = `Failed to capture photo: ${errorMessage}`;
      }

      Alert.alert("Error", userMessage, [{ text: "OK" }]);
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, isCameraReady, cameraPermission.isGranted]);

  // Handle save photo
  const handleSavePhoto = async () => {
    if (!capturedPhoto) return;

    try {
      setIsSaving(true);

      console.log("Saving photo with location...");
      await captureAndSavePhoto({
        uri: capturedPhoto,
        location: location,
        saveToCameraRollEnabled: true,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCapturedPhoto(null);
      router.push("/(tabs)/gallery");
    } catch (error) {
      console.error("Error saving photo:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      Alert.alert("Save Error", "Failed to save photo. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle retake photo
  const handleRetake = () => {
    setCapturedPhoto(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Toggle flash mode
  const toggleFlash = useCallback(() => {
    setFlashMode((current) => {
      if (current === "off") return "on";
      if (current === "on") return "auto";
      return "off";
    });
  }, []);

  // Flip camera
  const flipCamera = useCallback(() => {
    setIsCameraReady(false);
    setFacing((current) => (current === "back" ? "front" : "back"));
  }, []);

  // Show permission prompt if needed
  if (!cameraPermission.isGranted) {
    return (
      <PermissionPrompt
        type={!locationPermission.isGranted ? "both" : "camera"}
        canAskAgain={cameraPermission.canAskAgain}
        onRequestPermission={requestPermissions}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flashMode}
        onCameraReady={handleCameraReady}
        onMountError={handleMountError}
      />

      {/* UI Overlay */}
      <View style={styles.overlay} pointerEvents="box-none">
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
            style={[
              styles.captureButton,
              (!isCameraReady || isCapturing) && styles.captureButtonDisabled,
            ]}
            onPress={handleCapture}
            disabled={isCapturing || !isCameraReady}
          >
            <View
              style={[
                styles.captureButtonInner,
                (!isCameraReady || isCapturing) &&
                  styles.captureButtonInnerDisabled,
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading overlay */}
      {isCapturing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Capturing...</Text>
        </View>
      )}

      {/* Photo Preview Modal */}
      <Modal
        visible={capturedPhoto !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={handleRetake}
      >
        <View style={styles.previewContainer}>
          {capturedPhoto && (
            <Image
              source={{ uri: capturedPhoto }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}

          {/* Preview Actions */}
          <View style={styles.previewActions}>
            <TouchableOpacity
              style={[styles.previewButton, styles.retakeButton]}
              onPress={handleRetake}
              disabled={isSaving}
            >
              <Text style={styles.previewButtonText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.previewButton, styles.saveButton]}
              onPress={handleSavePhoto}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.previewButtonText}>Save Photo</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  topBar: {
    marginTop: 60,
    flexDirection: "column",
    gap: 16,
    paddingHorizontal: 20,
  },
  bottomBar: {
    marginBottom: 40,
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  captureButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.5)",
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
  },
  captureButtonInnerDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  previewActions: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    gap: 16,
  },
  previewButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  retakeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 2,
    borderColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  previewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
