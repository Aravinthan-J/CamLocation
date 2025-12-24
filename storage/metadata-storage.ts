import AsyncStorage from '@react-native-async-storage/async-storage';
import { PhotoMetadata } from '@/types/photo';

const METADATA_KEY = 'photos_metadata';

// Get all photo metadata
export async function getAllMetadata(): Promise<PhotoMetadata[]> {
  try {
    const data = await AsyncStorage.getItem(METADATA_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading metadata:', error);
    return [];
  }
}

// Save single photo metadata
export async function saveMetadata(photo: PhotoMetadata): Promise<void> {
  try {
    const existingData = await getAllMetadata();
    const updatedData = [...existingData, photo];
    await AsyncStorage.setItem(METADATA_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving metadata:', error);
    throw error;
  }
}

// Update existing photo metadata
export async function updateMetadata(photoId: string, updates: Partial<PhotoMetadata>): Promise<void> {
  try {
    const existingData = await getAllMetadata();
    const updatedData = existingData.map((photo) =>
      photo.id === photoId ? { ...photo, ...updates } : photo
    );
    await AsyncStorage.setItem(METADATA_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error updating metadata:', error);
    throw error;
  }
}

// Delete photo metadata
export async function deleteMetadata(photoId: string): Promise<void> {
  try {
    const existingData = await getAllMetadata();
    const filteredData = existingData.filter((photo) => photo.id !== photoId);
    await AsyncStorage.setItem(METADATA_KEY, JSON.stringify(filteredData));
  } catch (error) {
    console.error('Error deleting metadata:', error);
    throw error;
  }
}

// Get single photo metadata by ID
export async function getMetadataById(photoId: string): Promise<PhotoMetadata | null> {
  try {
    const allData = await getAllMetadata();
    return allData.find((photo) => photo.id === photoId) || null;
  } catch (error) {
    console.error('Error getting metadata by ID:', error);
    return null;
  }
}

// Clear all metadata
export async function clearAllMetadata(): Promise<void> {
  try {
    await AsyncStorage.removeItem(METADATA_KEY);
  } catch (error) {
    console.error('Error clearing metadata:', error);
    throw error;
  }
}

// Get photos sorted by timestamp (newest first)
export async function getMetadataSorted(): Promise<PhotoMetadata[]> {
  const data = await getAllMetadata();
  return data.sort((a, b) => b.timestamp - a.timestamp);
}

// Get photos with location only
export async function getMetadataWithLocation(): Promise<PhotoMetadata[]> {
  const data = await getAllMetadata();
  return data.filter((photo) => photo.location);
}
