import axios from 'axios';

// IMPORTANT: For Android Emulator, 'localhost' is the emulator itself.
// To connect to the computer where your server is running, you must use this special IP address.
const API_BASE_URL = 'http://192.168.0.108:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export default apiClient;