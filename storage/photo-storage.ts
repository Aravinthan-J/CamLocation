import * as FileSystem from 'expo-file-system';
import { documentDirectory } from 'expo-file-system';
import { PhotoMetadata } from '@/types/photo';

const PHOTOS_DIR = `${documentDirectory}photos/`;

// Ensure photos directory exists
export async function ensurePhotosDirectory(): Promise<void> {
  const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
  }
}

// Save photo to local storage
export async function savePhoto(
  sourceUri: string,
  photoId: string
): Promise<string> {
  await ensurePhotosDirectory();
  const fileName = `photo_${photoId}.jpg`;
  const destUri = `${PHOTOS_DIR}${fileName}`;
  await FileSystem.copyAsync({ from: sourceUri, to: destUri });
  return destUri;
}

// Delete photo from storage
export async function deletePhoto(uri: string): Promise<void> {
  const fileInfo = await FileSystem.getInfoAsync(uri);
  if (fileInfo.exists) {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  }
}

// Get all photo URIs
export async function getAllPhotoUris(): Promise<string[]> {
  await ensurePhotosDirectory();
  const files = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
  return files.map((file) => `${PHOTOS_DIR}${file}`);
}

// Clear all photos
export async function clearAllPhotos(): Promise<void> {
  await ensurePhotosDirectory();
  const files = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
  await Promise.all(
    files.map((file) =>
      FileSystem.deleteAsync(`${PHOTOS_DIR}${file}`, { idempotent: true })
    )
  );
}

// Get storage size
export async function getStorageSize(): Promise<number> {
  await ensurePhotosDirectory();
  const files = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
  let totalSize = 0;

  for (const file of files) {
    const fileInfo = await FileSystem.getInfoAsync(`${PHOTOS_DIR}${file}`);
    if (fileInfo.exists && 'size' in fileInfo) {
      totalSize += fileInfo.size;
    }
  }

  return totalSize;
}
