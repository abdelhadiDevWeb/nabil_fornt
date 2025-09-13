// API Configuration
// This file contains configuration constants for the application

// Backend API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://nabil-4.onrender.com';

// Helper function to construct API URLs
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};
