import { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { AllPermissions, PermissionStatus } from '@/types/permissions';
import { useCameraPermissions } from './use-camera-permissions';
import { useLocationPermissions } from './use-location-permissions';

export function useMediaLibraryPermissions() {
  const [status, setStatus] = useState<PermissionStatus>('undetermined');
  const [canAskAgain, setCanAskAgain] = useState(true);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const { status, canAskAgain } = await MediaLibrary.getPermissionsAsync(false);
    setStatus(status as PermissionStatus);
    setCanAskAgain(canAskAgain);
  };

  const requestPermission = async (): Promise<boolean> => {
    const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync(false);
    setStatus(status as PermissionStatus);
    setCanAskAgain(canAskAgain);
    return status === 'granted';
  };

  return {
    status,
    canAskAgain,
    requestPermission,
    checkPermission,
    isGranted: status === 'granted',
    isDenied: status === 'denied',
  };
}

export function useAllPermissions() {
  const camera = useCameraPermissions();
  const location = useLocationPermissions();
  const mediaLibrary = useMediaLibraryPermissions();

  const requestAll = async (): Promise<AllPermissions> => {
    const [cameraGranted, locationGranted, mediaLibraryGranted] = await Promise.all([
      camera.requestPermission(),
      location.requestPermission(),
      mediaLibrary.requestPermission(),
    ]);

    return {
      camera: cameraGranted ? 'granted' : camera.status,
      location: locationGranted ? 'granted' : location.status,
      mediaLibrary: mediaLibraryGranted ? 'granted' : mediaLibrary.status,
    };
  };

  const allGranted = camera.isGranted && location.isGranted && mediaLibrary.isGranted;

  return {
    camera,
    location,
    mediaLibrary,
    requestAll,
    allGranted,
  };
}
