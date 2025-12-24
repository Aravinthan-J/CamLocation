import { AddressData, LocationData } from '@/types/photo';

export async function reverseGeocode(
  location: LocationData
): Promise<AddressData | undefined> {
  console.warn('Reverse geocoding not available on web');
  return undefined;
}

export function formatCoordinates(latitude: number, longitude: number): string {
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lonDir = longitude >= 0 ? 'E' : 'W';
  return `${Math.abs(latitude).toFixed(6)}° ${latDir}, ${Math.abs(longitude).toFixed(6)}° ${lonDir}`;
}

export function clearGeocodeCache(): void {
  // No-op on web
}
