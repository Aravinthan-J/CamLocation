import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { LocationData } from "@/types/photo";

interface LocationIndicatorProps {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
}

export function LocationIndicator({
  location,
  loading,
  error,
}: LocationIndicatorProps) {
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#fff" />
        <Text style={styles.text}>Getting location...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Location unavailable</Text>
      </View>
    );
  }

  if (!location) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📍</Text>
      <Text style={styles.text}>{location.address?.formattedAddress}</Text>
      {location.accuracy && (
        <Text style={styles.accuracy}>±{Math.round(location.accuracy)}m</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  icon: {
    fontSize: 14,
  },
  text: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  accuracy: {
    color: "#ccc",
    fontSize: 10,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    fontWeight: "500",
  },
});
