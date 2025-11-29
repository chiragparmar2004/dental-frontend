"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/lib/api-client"

interface User {
  id: string
  name: string
  email: string
  role: "doctor" | "clinic" | "superadmin"
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token")
      if (storedToken) {
        setToken(storedToken)
        try {
          const response = await apiClient.get("/auth/me", {
            headers: { Authorization: `Bearer ${storedToken}` },
          })
          setUser(response.data.user)
        } catch (error) {
          console.error("Auth check failed:", error)
          localStorage.removeItem("token")
          setToken(null)
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/auth/login", { email, password })
      const { token, user: userData } = response.data
      localStorage.setItem("token", token)
      setToken(token)
      setUser(userData)
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`
      return { success: true }
    } catch (error: any) {
      console.error("Login failed:", error)
      
      // Extract error message
      let errorMessage = "Login failed. Please try again."
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.error || error.response.data?.message || errorMessage
      } else if (error.request) {
        // Request was made but no response received (server not running)
        errorMessage = "Cannot connect to server. Please ensure the backend server is running on port 5000."
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage
      }
      
      return { success: false, error: errorMessage }
    }
  }, [])

  const registerDoctor = useCallback(
    async (email: string, password: string, name: string, fullName: string, qualification: string) => {
      try {
        const response = await apiClient.post("/auth/register-doctor", {
          email,
          password,
          name,
          fullName,
          qualification,
        })
        const { token, user: userData } = response.data
        localStorage.setItem("token", token)
        setToken(token)
        setUser(userData)
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`
        return { success: true }
      } catch (error: any) {
        console.error("Doctor registration failed:", error)
        
        // Extract error message
        let errorMessage = "Registration failed. Please try again."
        
        if (error.response) {
          // Server responded with error status
          errorMessage = error.response.data?.error || error.response.data?.message || errorMessage
        } else if (error.request) {
          // Request was made but no response received (server not running)
          errorMessage = "Cannot connect to server. Please ensure the backend server is running on port 5000."
        } else {
          // Something else happened
          errorMessage = error.message || errorMessage
        }
        
        return { success: false, error: errorMessage }
      }
    },
    [],
  )

  const registerClinic = useCallback(
    async (email: string, password: string, name: string, clinicName: string, type: "clinic" | "hospital") => {
      try {
        const response = await apiClient.post("/auth/register-clinic", {
          email,
          password,
          name,
          clinicName,
          type,
        })
        const { token, user: userData } = response.data
        localStorage.setItem("token", token)
        setToken(token)
        setUser(userData)
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`
        return { success: true }
      } catch (error: any) {
        console.error("Clinic registration failed:", error)
        
        // Extract error message
        let errorMessage = "Registration failed. Please try again."
        
        if (error.response) {
          // Server responded with error status
          errorMessage = error.response.data?.error || error.response.data?.message || errorMessage
        } else if (error.request) {
          // Request was made but no response received (server not running)
          errorMessage = "Cannot connect to server. Please ensure the backend server is running on port 5000."
        } else {
          // Something else happened
          errorMessage = error.message || errorMessage
        }
        
        return { success: false, error: errorMessage }
      }
    },
    [],
  )

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    delete apiClient.defaults.headers.common["Authorization"]
  }, [])

  return {
    user,
    loading,
    token,
    login,
    registerDoctor,
    registerClinic,
    logout,
  }
}
