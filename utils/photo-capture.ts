import { PhotoMetadata, LocationData } from "@/types/photo";
import { savePhoto } from "@/storage/photo-storage";
import { saveMetadata } from "@/storage/metadata-storage";
import { reverseGeocode, formatCoordinates } from "./geocoding";
import { saveToCameraRoll, generatePhotoId } from "./file-manager";
import * as ImageManipulator from "expo-image-manipulator";

export interface CapturePhotoOptions {
  uri: string;
  location?: LocationData | null;
  saveToCameraRollEnabled?: boolean;
}

export async function captureAndSavePhoto(
  options: CapturePhotoOptions
): Promise<PhotoMetadata> {
  const { uri, location, saveToCameraRollEnabled = true } = options;

  // Generate unique ID
  const photoId = generatePhotoId();
  const timestamp = Date.now();

  try {
    let processedUri = uri;

    // Get address if location is available
    let locationWithAddress = location;
    if (location) {
      const address = await reverseGeocode(location);
      locationWithAddress = { ...location, address };

      // Add watermark with location information
      processedUri = await addLocationWatermark(uri, locationWithAddress);
    }

    // Save photo to app storage
    const savedUri = await savePhoto(processedUri, photoId);

    // Create metadata
    const metadata: PhotoMetadata = {
      id: photoId,
      uri: savedUri,
      timestamp,
      location: locationWithAddress ?? undefined,
    };

    // Save metadata
    await saveMetadata(metadata);

    // Save to camera roll if enabled
    if (saveToCameraRollEnabled) {
      await saveToCameraRoll(savedUri);
    }

    return metadata;
  } catch (error) {
    console.error("Error capturing and saving photo:", error);
    throw error;
  }
}

async function addLocationWatermark(
  uri: string,
  location: LocationData
): Promise<string> {
  try {
    // Note: Expo doesn't have built-in text watermarking
    // For now, we'll just return the original image
    // The location info is still saved in metadata and can be viewed in the gallery

    // Future enhancement: Use react-native-view-shot to capture a View
    // with the image and text overlay rendered using React Native components

    console.log("Watermark info:", {
      address: location.address?.formattedAddress,
      coordinates: formatCoordinates(location.latitude, location.longitude),
      time: new Date().toLocaleString()
    });

    return uri;
  } catch (error) {
    console.error("Error in watermark function:", error);
    return uri;
  }
}
