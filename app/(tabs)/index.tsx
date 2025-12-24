import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, setLocationPermission] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState("Getting location...");
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");
    })();
  }, []);

  // Update location continuously when camera is open
  useEffect(() => {
    let locationSubscription;

    const startLocationTracking = async () => {
      if (showCamera && locationPermission) {
        try {
          // Get initial location
          const location = await Location.getCurrentPositionAsync({});
          updateLocationData(location);

          // Watch location updates
          locationSubscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 2000, // Update every 2 seconds
              distanceInterval: 10, // Or when moved 10 meters
            },
            (newLocation) => {
              updateLocationData(newLocation);
            }
          );
        } catch (error) {
          console.error("Location tracking error:", error);
          setCurrentAddress("Location unavailable");
        }
      }
    };

    const updateLocationData = async (location) => {
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      try {
        const addressResponse = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (addressResponse[0]) {
          const addr = addressResponse[0];
          console.log(addr, addressResponse);
          const fullAddress = `${addr.formattedAddress}`.replace(
            /^, |, $|, , /g,
            ", "
          );
          setCurrentAddress(fullAddress);
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    };

    startLocationTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [showCamera, locationPermission]);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need camera permission</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        // Use current location data
        const locationData = currentLocation;
        const address = currentAddress;

        // Take photo
        const photo = await cameraRef.current.takePictureAsync();

        // Add photo with location data
        setPhotos((prev) => [
          {
            uri: photo.uri,
            location: locationData,
            address: address,
            timestamp: new Date().toLocaleString(),
          },
          ...prev,
        ]);

        Alert.alert("Success!", "Photo captured with location data");
      } catch (error) {
        Alert.alert("Error", "Failed to capture photo");
        console.error(error);
      }
    }
  };

  if (showCamera) {
    return (
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          {/* Location overlay at the top */}
          <View style={styles.locationOverlay}>
            {locationPermission && currentLocation ? (
              <>
                <Text style={styles.locationText}>
                  📍 Lat: {currentLocation.latitude.toFixed(6)}
                </Text>
                <Text style={styles.locationText}>
                  Lng: {currentLocation.longitude.toFixed(6)}
                </Text>
                <Text style={styles.addressText}>{currentAddress}</Text>
              </>
            ) : (
              <Text style={styles.locationText}>Location unavailable</Text>
            )}
          </View>

          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.flipText}>Flip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📸 CamLocation</Text>
        <Text style={styles.subtitle}>Photos with GPS Data</Text>
      </View>

      <TouchableOpacity
        style={styles.openCameraButton}
        onPress={() => setShowCamera(true)}
      >
        <Text style={styles.openCameraText}>Open Camera</Text>
      </TouchableOpacity>

      {!locationPermission && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ Location permission not granted. Photos won't have GPS data.
          </Text>
        </View>
      )}

      <ScrollView style={styles.gallery}>
        <Text style={styles.galleryTitle}>Gallery ({photos.length})</Text>
        {photos.length === 0 ? (
          <Text style={styles.emptyText}>
            No photos yet. Take your first photo!
          </Text>
        ) : (
          photos.map((photo, index) => (
            <View key={index} style={styles.photoCard}>
              <Image source={{ uri: photo.uri }} style={styles.photoImage} />
              <View style={styles.photoInfo}>
                <Text style={styles.timestamp}>📅 {photo.timestamp}</Text>
                {photo.location ? (
                  <>
                    <Text style={styles.coordinates}>
                      📍 Lat: {photo.location.latitude.toFixed(6)}
                    </Text>
                    <Text style={styles.coordinates}>
                      📍 Lng: {photo.location.longitude.toFixed(6)}
                    </Text>
                    <Text style={styles.address}>{photo.address}</Text>
                  </>
                ) : (
                  <Text style={styles.noLocation}>No location data</Text>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#4CAF50",
    padding: 20,
    paddingTop: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 14,
    color: "white",
    marginTop: 5,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  locationOverlay: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 15,
    paddingHorizontal: 20,
  },
  locationText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 3,
  },
  addressText: {
    color: "#4CAF50",
    fontSize: 13,
    marginTop: 5,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingBottom: 40,
  },
  flipButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 15,
    borderRadius: 10,
  },
  flipText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CAF50",
  },
  closeButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 15,
    borderRadius: 10,
  },
  closeText: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  openCameraButton: {
    backgroundColor: "#4CAF50",
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  openCameraText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  warningBox: {
    backgroundColor: "#FFF3CD",
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107",
  },
  warningText: {
    color: "#856404",
    fontSize: 14,
  },
  gallery: {
    flex: 1,
  },
  galleryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 20,
    marginBottom: 10,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 20,
  },
  photoCard: {
    backgroundColor: "white",
    margin: 20,
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  photoImage: {
    width: "100%",
    height: 300,
  },
  photoInfo: {
    padding: 15,
  },
  timestamp: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  coordinates: {
    fontSize: 13,
    color: "#333",
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: "#4CAF50",
    marginTop: 8,
    fontWeight: "500",
  },
  noLocation: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
});
