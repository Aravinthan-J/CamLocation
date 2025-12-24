import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export async function saveToCameraRoll(uri: string): Promise<string | null> {
  try {
    const { status } = await MediaLibrary.getPermissionsAsync();

    if (status !== 'granted') {
      const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        console.error('Media library permission not granted');
        return null;
      }
    }

    const asset = await MediaLibrary.createAssetAsync(uri);
    return asset.uri;
  } catch (error) {
    console.error('Error saving to camera roll:', error);
    return null;
  }
}

export async function getFileSize(uri: string): Promise<number> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (fileInfo.exists && 'size' in fileInfo) {
      return fileInfo.size;
    }
    return 0;
  } catch (error) {
    console.error('Error getting file size:', error);
    return 0;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function generatePhotoId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
