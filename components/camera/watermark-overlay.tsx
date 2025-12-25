import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { LocationData } from "@/types/photo";
import { formatCoordinates } from "@/utils/geocoding";

const { width, height } = Dimensions.get("window");

interface WatermarkOverlayProps {
  imageUri: string;
  location: LocationData;
}

export function WatermarkOverlay({
  imageUri,
  location,
}: WatermarkOverlayProps) {
  const address = location.address?.fullAddress || "Unknown location";
  const coordinates = formatCoordinates(location.latitude, location.longitude);
  const dateTime = new Date().toLocaleString();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.watermark}>
        <Text style={styles.emoji}>📍</Text>
        <View style={styles.textContainer}>
          <Text style={styles.address}>{address}</Text>
          <Text style={styles.coordinates}>{coordinates}</Text>
          <Text style={styles.dateTime}>{dateTime}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: "#0000000f",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  watermark: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emoji: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  address: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  coordinates: {
    color: "#ddd",
    fontSize: 12,
    marginBottom: 2,
  },
  dateTime: {
    color: "#bbb",
    fontSize: 11,
  },
});
