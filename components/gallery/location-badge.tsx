import { View, Text, StyleSheet } from "react-native";
import { LocationData } from "@/types/photo";
import { formatCoordinates } from "@/utils/geocoding";

interface LocationBadgeProps {
  location?: LocationData;
  compact?: boolean;
}

export function LocationBadge({
  location,
  compact = false,
}: LocationBadgeProps) {
  if (!location) {
    return (
      <View style={styles.container}>
        <Text style={styles.noLocation}>No location data</Text>
      </View>
    );
  }

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.icon}>📍</Text>
        {location.address && (
          <Text style={styles.compactText} numberOfLines={1}>
            {location.address.district ||
              location.address.city ||
              location.address.formattedAddress}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📍</Text>
      <View style={styles.content}>
        {location.address && (
          <Text style={styles.address} numberOfLines={2}>
            {location.address.fullAddress}
          </Text>
        )}
        <Text style={styles.coordinates}>
          {formatCoordinates(location.latitude, location.longitude)}
        </Text>
        {location.accuracy && (
          <Text style={styles.accuracy}>
            Accuracy: ±{Math.round(location.accuracy)}m
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    gap: 8,
  },
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
  },
  icon: {
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  address: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  coordinates: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  accuracy: {
    fontSize: 11,
    color: "#999",
  },
  compactText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
    flex: 1,
  },
  noLocation: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
});
