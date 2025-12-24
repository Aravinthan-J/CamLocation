import { useState } from 'react';
import { PermissionStatus } from '@/types/permissions';

export function useCameraPermissions() {
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
