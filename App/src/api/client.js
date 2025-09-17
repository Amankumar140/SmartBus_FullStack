

import axios from 'axios';
import { API_IP_ADDRESS } from '@env';

// IMPORTANT: For Android Emulator, 'localhost' is the emulator itself.
// To connect to the computer where your server is running, you must use this special IP address.
const API_BASE_URL = `http://${API_IP_ADDRESS}:3001/api`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export default apiClient;