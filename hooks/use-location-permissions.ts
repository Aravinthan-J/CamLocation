import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { PermissionStatus } from '@/types/permissions';

export function useLocationPermissions() {
  const [status, setStatus] = useState<PermissionStatus>('undetermined');
  const [canAskAgain, setCanAskAgain] = useState(true);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
    setStatus(status as PermissionStatus);
    setCanAskAgain(canAskAgain);
  };

  const requestPermission = async (): Promise<boolean> => {
    const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
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
