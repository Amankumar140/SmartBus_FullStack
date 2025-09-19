import axios from 'axios';
import { Platform } from 'react-native';
import { API_IP_ADDRESS } from '@env';

// Production URLs (Render deployment)
const PRODUCTION_API_BASE_URL = 'https://smartbus-fullstack.onrender.com/api';
const PRODUCTION_SOCKET_URL = 'https://smartbus-fullstack.onrender.com';

// Development URLs
const DEV_API_HOST = API_IP_ADDRESS || '192.168.0.108';
const DEV_API_BASE_URL = `http://${DEV_API_HOST}:3001/api`;
const DEV_SOCKET_URL = `http://${DEV_API_HOST}:3001`;

// Use production URLs for release builds, development URLs for debug
export const API_BASE_URL = __DEV__ ? DEV_API_BASE_URL : PRODUCTION_API_BASE_URL;
export const SOCKET_URL = __DEV__ ? DEV_SOCKET_URL : PRODUCTION_SOCKET_URL;

console.log('🌐 API Configuration:');
console.log('📡 API Base URL:', API_BASE_URL);
console.log('🔌 Socket URL:', SOCKET_URL);
console.log('🛠️ Development Mode:', __DEV__);

// Axios client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export default apiClient;
