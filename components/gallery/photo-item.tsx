import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  View,
} from "react-native";
import { PhotoMetadata } from "@/types/photo";
import { LocationBadge } from "./location-badge";

const { width } = Dimensions.get("window");
const ITEM_SIZE = width / 3 - 8;

interface PhotoItemProps {
  photo: PhotoMetadata;
  onPress: () => void;
}

export function PhotoItem({ photo, onPress }: PhotoItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: photo.uri }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.locationOverlay}>
        {photo.location && <LocationBadge location={photo.location} compact />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 4,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  locationOverlay: {
    position: "absolute",
    width: "100%",
    bottom: 2,
    right: "auto",
  },
});
