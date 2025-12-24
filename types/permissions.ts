export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface PermissionResponse {
  status: PermissionStatus;
  canAskAgain: boolean;
  expires: 'never' | number;
}

export interface AllPermissions {
  camera: PermissionStatus;
  location: PermissionStatus;
  mediaLibrary: PermissionStatus;
}
