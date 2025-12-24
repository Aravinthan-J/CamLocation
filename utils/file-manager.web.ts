export async function saveToCameraRoll(uri: string): Promise<string | null> {
  console.warn('Camera roll saving not available on web');
  return null;
}

export async function getFileSize(uri: string): Promise<number> {
  return 0;
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
