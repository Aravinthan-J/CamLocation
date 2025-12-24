export interface Coordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
}

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}
