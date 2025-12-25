import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";
import { PhotoMetadata } from "@/types/photo";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

interface PhotoDetailModalProps {
  visible: boolean;
  photo: PhotoMetadata | null;
  onClose: () => void;
  onDelete: (photoId: string) => Promise<void>;
}

export function PhotoDetailModal({
  visible,
  photo,
  onClose,
  onDelete,
}: PhotoDetailModalProps) {
  // Animated values for zoom and pan (hooks must always be called in the same order)
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

  const handleClose = () => {
    resetZoom();
    onClose();
  };

  const handleShare = async () => {
    if (!photo) return;

    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Error", "Sharing is not available on this device");
        return;
      }

      await Sharing.shareAsync(photo.uri, {
        mimeType: "image/jpeg",
        dialogTitle: "Share Photo with Location",
        UTI: "public.jpeg",
      });
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert("Error", "Failed to share photo");
    }
  };

  const handleDelete = () => {
    if (!photo) return;

    Alert.alert("Delete Photo", "Are you sure you want to delete this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await onDelete(photo.id);
            resetZoom();
            onClose();
          } catch (error) {
            Alert.alert("Error", "Failed to delete photo");
          }
        },
      },
    ]);
  };

  // Pinch gesture for zooming
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      // Limit zoom between 1x and 4x
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
        // Calculate boundaries to prevent panning too far
        const maxTranslateX = (width * (savedScale.value - 1)) / 2;
        const maxTranslateY = (height * 0.7 * (savedScale.value - 1)) / 2;

        const newTranslateX = savedTranslateX.value + event.translationX;
        const newTranslateY = savedTranslateY.value + event.translationY;

        // Limit translation to image boundaries
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
        // Zoom out
        scale.value = withSpring(1);
        savedScale.value = 1;
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        // Zoom in to 2x
        scale.value = withSpring(2);
        savedScale.value = 2;
      }
    });

  // Combine gestures
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

  // Don't render modal if photo is null
  if (!photo) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.headerButton}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={handleShare}
                style={styles.headerButton}
              >
                <Ionicons name="share-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.headerButton}
              >
                <Ionicons name="trash-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Photo with zoom and pan */}
          <View style={styles.imageContainer}>
            <GestureDetector gesture={composedGesture}>
              <Animated.Image
                source={{ uri: photo.uri }}
                style={[styles.image, animatedStyle]}
                resizeMode="contain"
              />
            </GestureDetector>
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
    position: "relative",
  },
  header: {
    position: "absolute",
    top: 0,
    zIndex: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  imageContainer: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  image: {
    width: "100%",
    height: height * 0.8,
  },
});
