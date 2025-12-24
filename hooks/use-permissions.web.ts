import { useState } from 'react';
import { AllPermissions, PermissionStatus } from '@/types/permissions';
import { useCameraPermissions } from './use-camera-permissions';
import { useLocationPermissions } from './use-location-permissions';

export function useMediaLibraryPermissions() {
  const [status] = useState<PermissionStatus>('denied');

  return {
    status,
    canAskAgain: false,
    requestPermission: async () => false,
    checkPermission: async () => {},
    isGranted: false,
    isDenied: true,
  };
}

export function useAllPermissions() {
  const camera = useCameraPermissions();
  const location = useLocationPermissions();
  const mediaLibrary = useMediaLibraryPermissions();

  const requestAll = async (): Promise<AllPermissions> => {
    return {
      camera: 'denied',
      location: 'denied',
      mediaLibrary: 'denied',
    };
  };

  return {
    camera,
    location,
    mediaLibrary,
    requestAll,
    allGranted: false,
  };
}
