import { useState, useEffect, useCallback } from 'react';
import { PhotoMetadata } from '@/types/photo';
import {
  getAllMetadata,
  getMetadataSorted,
  getMetadataWithLocation,
  deleteMetadata,
} from '@/storage/metadata-storage';
import { deletePhoto } from '@/storage/photo-storage';

export function usePhotos() {
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPhotos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMetadataSorted();
      setPhotos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const deletePhotoById = async (photoId: string): Promise<void> => {
    try {
      const photo = photos.find((p) => p.id === photoId);
      if (!photo) {
        throw new Error('Photo not found');
      }

      // Delete from storage
      await deletePhoto(photo.uri);
      // Delete metadata
      await deleteMetadata(photoId);

      // Update state
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete photo');
    }
  };

  const refresh = () => {
    loadPhotos();
  };

  const photosWithLocation = photos.filter((photo) => photo.location);

  return {
    photos,
    photosWithLocation,
    loading,
    error,
    deletePhotoById,
    refresh,
  };
}
