import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { LocationData } from "@/types/photo";
import { reverseGeocode } from "@/utils/geocoding";

export function useCurrentLocation(enabled: boolean = true) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (enabled) {
      getCurrentLocation();
    }
  }, [enabled]);

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    setLoading(true);
    setError(null);

    try {
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Location permission not granted");
        setLoading(false);
        return null;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        timeInterval: 10000, // 10 seconds
        distanceInterval: 10, // 10 meters
      });

      let locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude ?? undefined,
        accuracy: position.coords.accuracy ?? undefined,
      };

      const address = await reverseGeocode(locationData);
      if (address) {
        locationData = {
          ...locationData,
          address: address,
        };
      }
      setLocation(locationData);
      setLoading(false);
      return locationData;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get location";
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  const refresh = () => {
    getCurrentLocation();
  };

  return {
    location,
    loading,
    error,
    refresh,
    getCurrentLocation,
  };
}
