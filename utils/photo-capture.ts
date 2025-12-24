import * as ImageManipulator from 'expo-image-manipulator';
import { PhotoMetadata, LocationData } from '@/types/photo';
import { savePhoto } from '@/storage/photo-storage';
import { saveMetadata } from '@/storage/metadata-storage';
import { reverseGeocode } from './geocoding';
import { saveToCameraRoll, generatePhotoId } from './file-manager';

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
    // Process image with location data if available
    let processedUri = uri;

    if (location) {
      // Add EXIF data with location
      processedUri = await addExifData(uri, location);
    }

    // Save photo to app storage
    const savedUri = await savePhoto(processedUri, photoId);

    // Get address if location is available
    let locationWithAddress = location;
    if (location) {
      const address = await reverseGeocode(location);
      locationWithAddress = { ...location, address };
    }

    // Create metadata
    const metadata: PhotoMetadata = {
      id: photoId,
      uri: savedUri,
      timestamp,
      location: locationWithAddress,
    };

    // Save metadata
    await saveMetadata(metadata);

    // Save to camera roll if enabled
    if (saveToCameraRollEnabled) {
      await saveToCameraRoll(savedUri);
    }

    return metadata;
  } catch (error) {
    console.error('Error capturing and saving photo:', error);
    throw error;
  }
}

async function addExifData(
  uri: string,
  location: LocationData
): Promise<string> {
  try {
    // expo-image-manipulator doesn't directly support EXIF embedding
    // For now, we'll just return the original URI
    // In a production app, you might use a library like piexifjs
    // or handle EXIF on the native side

    // Note: The location data will still be stored in metadata
    // and can be embedded when saving to camera roll using MediaLibrary
    return uri;
  } catch (error) {
    console.error('Error adding EXIF data:', error);
    return uri;
  }
}
