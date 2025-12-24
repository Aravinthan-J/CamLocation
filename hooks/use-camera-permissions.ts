import { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import { PermissionStatus } from '@/types/permissions';

export function useCameraPermissions() {
  const [status, setStatus] = useState<PermissionStatus>('undetermined');
  const [canAskAgain, setCanAskAgain] = useState(true);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const { status, canAskAgain } = await Camera.getCameraPermissionsAsync();
    setStatus(status as PermissionStatus);
    setCanAskAgain(canAskAgain);
  };

  const requestPermission = async (): Promise<boolean> => {
    const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync();
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
