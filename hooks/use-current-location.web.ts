import { useState } from 'react';
import { LocationData } from '@/types/photo';

export function useCurrentLocation(enabled: boolean = true) {
  const [location] = useState<LocationData | null>(null);
  const [loading] = useState(false);
  const [error] = useState<string | null>('Location not available on web');

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    return null;
  };

  const refresh = () => {};

  return {
    location,
    loading,
    error,
    refresh,
    getCurrentLocation,
  };
}
