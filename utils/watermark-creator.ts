import { LocationData } from "@/types/photo";
import { formatCoordinates } from "./geocoding";

export interface WatermarkData {
  address: string;
  coordinates: string;
  dateTime: string;
}

export function prepareWatermarkData(location: LocationData): WatermarkData {
  const address = location.address?.formattedAddress || "Unknown location";
  const coordinates = formatCoordinates(location.latitude, location.longitude);
  const dateTime = new Date().toLocaleString();

  return {
    address,
    coordinates,
    dateTime,
  };
}
