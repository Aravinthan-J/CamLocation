import * as Location from 'expo-location';
import { AddressData, LocationData } from '@/types/photo';

// Cache for geocoded addresses to avoid repeated API calls
const geocodingCache = new Map<string, AddressData>();

function getCacheKey(latitude: number, longitude: number): string {
  // Round to 4 decimal places (~11 meters accuracy) for cache key
  return `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
}

export async function reverseGeocode(
  location: LocationData
): Promise<AddressData | undefined> {
  try {
    const cacheKey = getCacheKey(location.latitude, location.longitude);

    // Check cache first
    if (geocodingCache.has(cacheKey)) {
      return geocodingCache.get(cacheKey);
    }

    const addresses = await Location.reverseGeocodeAsync({
      latitude: location.latitude,
      longitude: location.longitude,
    });

    if (addresses && addresses.length > 0) {
      const address = addresses[0];
      const addressData: AddressData = {
        street: address.street ?? undefined,
        city: address.city ?? undefined,
        region: address.region ?? undefined,
        country: address.country ?? undefined,
        postalCode: address.postalCode ?? undefined,
        formattedAddress: formatAddress(address),
      };

      // Cache the result
      geocodingCache.set(cacheKey, addressData);

      return addressData;
    }

    return undefined;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return undefined;
  }
}

function formatAddress(address: Location.LocationGeocodedAddress): string {
  const parts: string[] = [];

  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.region) parts.push(address.region);
  if (address.country) parts.push(address.country);

  return parts.join(', ') || 'Unknown location';
}

export function formatCoordinates(latitude: number, longitude: number): string {
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lonDir = longitude >= 0 ? 'E' : 'W';
  return `${Math.abs(latitude).toFixed(6)}° ${latDir}, ${Math.abs(longitude).toFixed(6)}° ${lonDir}`;
}

export function clearGeocodeCache(): void {
  geocodingCache.clear();
}
