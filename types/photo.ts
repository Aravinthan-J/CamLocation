export interface PhotoMetadata {
  id: string;
  uri: string; // Local file URI
  timestamp: number;
  location?: LocationData;
  exifData?: ExifData;
  thumbnailUri?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  address?: AddressData | null;
}

export interface AddressData {
  district?: string;
  street?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  formattedAddress: string;
  fullAddress: string;
}

export interface ExifData {
  Make?: string;
  Model?: string;
  Orientation?: number;
  DateTime?: string;
  GPSLatitude?: number;
  GPSLongitude?: number;
  GPSAltitude?: number;
  ImageWidth?: number;
  ImageHeight?: number;
}
