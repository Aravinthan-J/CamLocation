import { PhotoMetadata, LocationData } from '@/types/photo';
import { savePhoto } from '@/storage/photo-storage';
import { saveMetadata } from '@/storage/metadata-storage';
import { generatePhotoId } from './file-manager';

export interface CapturePhotoOptions {
  uri: string;
  location?: LocationData | null;
  saveToCameraRollEnabled?: boolean;
}

export async function captureAndSavePhoto(
  options: CapturePhotoOptions
): Promise<PhotoMetadata> {
  const { uri, location } = options;

  const photoId = generatePhotoId();
  const timestamp = Date.now();

  try {
    const savedUri = await savePhoto(uri, photoId);

    const metadata: PhotoMetadata = {
      id: photoId,
      uri: savedUri,
      timestamp,
      location: location,
    };

    await saveMetadata(metadata);

    return metadata;
  } catch (error) {
    console.error('Error capturing and saving photo:', error);
    throw error;
  }
}
