import axios from 'axios';
import { Platform } from 'react-native';
import { API_IP_ADDRESS } from '@env';

// Decide the host depending on platform (emulator vs device)
const API_HOST =
  Platform.OS === 'android'
    ? (__DEV__ ? '10.0.2.2' : API_IP_ADDRESS) // Android Emulator in dev
    : API_IP_ADDRESS; // iOS simulator + physical devices

// Base URLs
export const API_BASE_URL = `http://${API_HOST}:3001/api`;
export const SOCKET_URL = `http://${API_HOST}:3001`;

// Axios client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export default apiClient;
