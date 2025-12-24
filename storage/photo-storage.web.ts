import { PhotoMetadata } from '@/types/photo';

// Web uses localStorage instead of FileSystem
const PHOTOS_STORAGE_KEY = 'camlocation_photos';

interface PhotoStore {
  [key: string]: string; // photoId -> base64 data URL
}

function getPhotoStore(): PhotoStore {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(PHOTOS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

function savePhotoStore(store: PhotoStore): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(store));
}

export async function ensurePhotosDirectory(): Promise<void> {
  // No-op on web
}

export async function savePhoto(
  sourceUri: string,
  photoId: string
): Promise<string> {
  const store = getPhotoStore();
  store[photoId] = sourceUri;
  savePhotoStore(store);
  return sourceUri;
}

export async function deletePhoto(uri: string): Promise<void> {
  const store = getPhotoStore();
  const photoId = Object.keys(store).find(key => store[key] === uri);
  if (photoId) {
    delete store[photoId];
    savePhotoStore(store);
  }
}

export async function getAllPhotoUris(): Promise<string[]> {
  const store = getPhotoStore();
  return Object.values(store);
}

export async function clearAllPhotos(): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PHOTOS_STORAGE_KEY);
}

export async function getStorageSize(): Promise<number> {
  const store = getPhotoStore();
  const dataString = JSON.stringify(store);
  return new Blob([dataString]).size;
}
