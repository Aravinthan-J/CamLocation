import { LocationData } from "@/types/photo";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { WatermarkOverlay } from "./watermark-overlay";

const { width, height } = Dimensions.get("window");

interface PhotoPreviewModalProps {
  visible: boolean;
  photoUri: string | null;
  location: LocationData | null;
  isSaving: boolean;
  onSave: () => void;
  onRetake: () => void;
  watermarkViewRef?: React.RefObject<View | null>;
}

export function PhotoPreviewModal({
  visible,
  photoUri,
  location,
  isSaving,
  onSave,
  onRetake,
  watermarkViewRef,
}: PhotoPreviewModalProps) {
  // Zoom and pan values
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const resetZoom = () => {
    scale.value = withSpring(1);
    savedScale.value = 1;
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  };

  const handleRetake = () => {
    resetZoom();
    onRetake();
  };

  // Pinch gesture for zooming
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
      } else if (scale.value > 4) {
        scale.value = withSpring(4);
        savedScale.value = 4;
      } else {
        savedScale.value = scale.value;
      }
    });

  // Pan gesture for moving the image when zoomed
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (savedScale.value > 1) {
        const maxTranslateX = (width * (savedScale.value - 1)) / 2;
        const maxTranslateY = (height * (savedScale.value - 1)) / 2;

        const newTranslateX = savedTranslateX.value + event.translationX;
        const newTranslateY = savedTranslateY.value + event.translationY;

        translateX.value = Math.max(
          -maxTranslateX,
          Math.min(maxTranslateX, newTranslateX)
        );
        translateY.value = Math.max(
          -maxTranslateY,
          Math.min(maxTranslateY, newTranslateY)
        );
      }
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // Double-tap to zoom in/out
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (savedScale.value > 1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        scale.value = withSpring(2);
        savedScale.value = 2;
      }
    });

  const composedGesture = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    doubleTapGesture
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  if (!photoUri) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleRetake}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <GestureDetector gesture={composedGesture}>
            <Animated.View style={[styles.imageContainer, animatedStyle]}>
              {location ? (
                <View ref={watermarkViewRef} collapsable={false}>
                  <WatermarkOverlay imageUri={photoUri} location={location} />
                </View>
              ) : (
                <Image
                  source={{ uri: photoUri }}
                  style={styles.image}
                  resizeMode="contain"
                />
              )}
            </Animated.View>
          </GestureDetector>

          {/* Preview Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.retakeButton]}
              onPress={handleRetake}
              disabled={isSaving}
            >
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={onSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save Photo</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },
  imageContainer: {
    width: "100%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "auto",
  },
  actions: {
    // position: "absolute",
    // bottom: 40,
    // left: 20,
    // right: 20,
    height: "auto",
    flexDirection: "row",
    gap: 16,
  },
  button: {
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
