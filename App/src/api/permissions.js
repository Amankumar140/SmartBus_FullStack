// permissions.js
import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestCameraPermission = async () => {
  const permission =
    Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.CAMERA
      : PERMISSIONS.IOS.CAMERA;

  const result = await request(permission);
  return result === RESULTS.GRANTED;
};

export const requestMediaPermission = async () => {
  let permission;
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      // Android 13+
      permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
    } else {
      permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    }
  } else {
    permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
  }

  const result = await request(permission);
  return result === RESULTS.GRANTED;
};

export const requestLocationPermission = async () => {
  const permission =
    Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

  const result = await request(permission);
  return result === RESULTS.GRANTED;
};
