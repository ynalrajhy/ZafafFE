import axios, { AxiosInstance, AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

// Helper to get the correct base URL for development
const getBaseUrl = (): string => {
  // For local development
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];
  if (localhost) {
    // Running on physical device or emulator via Expo Go
    return `http://${localhost}:5000/api`;
  }
  // Fallback for iOS Simulator or other cases
  return "http://localhost:5000/api";
};

export const BASE_URL = getBaseUrl();
console.log("🔌 API Base URL configured to:", BASE_URL);

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      await AsyncStorage.removeItem("userToken");
    }
    return Promise.reject(error);
  }
);

export default api;
