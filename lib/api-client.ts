import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
})

// Helper to check if we're in browser environment
const isBrowser = typeof window !== "undefined"

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    // Only access localStorage in browser environment
    if (isBrowser) {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error logging
    if (error.response) {
      // Server responded with error status
      console.error("API Error Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
      })

      if (error.response.status === 401) {
        if (isBrowser) {
          localStorage.removeItem("token")
          window.location.href = "/login"
        }
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("API Network Error:", {
        message: error.message,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      })
      console.error(
        "This usually means the backend server is not running or not accessible. Please check:",
        "\n1. Is the backend server running on port 5000?",
        "\n2. Is the API_BASE_URL correct?",
        "\n3. Are there any CORS issues?",
      )
    } else {
      // Something else happened
      console.error("API Error:", error.message)
    }

    return Promise.reject(error)
  },
)
