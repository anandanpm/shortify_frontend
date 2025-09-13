
import  { type AxiosError } from "axios"
import axiosInstance from "./axiosInstance"

// Define interfaces for your API responses
interface User {
  id: string
  name: string
  email: string
}

interface UrlItem {
  id: string
  originalUrl: string
  shortUrl: string
  shortCode: string
  clickCount:number
  createdAt: string
}

interface BackendResponse<T = any> {
  success: boolean
  message: string
  data?: T
}

interface ErrorResponse {
  success: boolean
  message: string
}

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   withCredentials: true,
// })

const api = {
  register: async (name: string, email: string, password: string): Promise<User> => {
    try {
      const response = await axiosInstance.post<BackendResponse<{ user: User }>>("/user/register", {
        name,
        email,
        password,
      })
      console.log("✅ Register success:", response.data)
      return response.data.data!.user
    } catch (error) {
      console.log("❌ Register error:", error)
      const axiosError = error as AxiosError<ErrorResponse>

      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message)
      } else if (axiosError.message) {
        throw new Error(axiosError.message)
      } else {
        throw new Error("Registration failed. Please try again.")
      }
    }
  },

  login: async (email: string, password: string): Promise<User> => {
    try {
      const response = await axiosInstance.post<BackendResponse<{ user: User }>>("/user/login", {
        email,
        password,
      })
      console.log("✅ Login success:", response.data)
      return response.data.data!.user
    } catch (error) {
      console.log("❌ Login error:", error)
      const axiosError = error as AxiosError<ErrorResponse>

      // Extract error message from different possible locations
      if (axiosError.response?.data?.message) {
        console.log("Error message from response:", axiosError.response.data.message)
        throw new Error(axiosError.response.data.message)
      } else if (axiosError.response?.status === 401) {
        throw new Error("Invalid email or password")
      } else if (axiosError.response?.status === 400) {
        throw new Error("Please provide valid email and password")
      } else if (axiosError.message) {
        throw new Error(axiosError.message)
      } else {
        throw new Error("Login failed. Please try again.")
      }
    }
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post("/user/logout")
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message)
      } else {
        throw new Error("Logout failed")
      }
    }
  },

  refreshToken: async (): Promise<User> => {
    try {
      const response = await axiosInstance.post<BackendResponse<{ user: User }>>("/user/refresh-token")
      return response.data.data!.user
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message)
      } else {
        throw new Error("Session expired. Please login again.")
      }
    }
  },

  // URL-related API functions
  shortenUrl: async (
    originalUrl: string,
  ): Promise<
    BackendResponse<{
      originalUrl: string
      shortUrl: string
      shortCode: string
      clickCount:number
    }>
  > => {
    try {
      const response = await axiosInstance.post<
        BackendResponse<{
          originalUrl: string
          shortUrl: string
          shortCode: string
          clickCount:number
        }>
      >("/url/shorten", {
        originalUrl,
      })
      console.log("✅ Shorten URL success:", response.data)
      return response.data
    } catch (error) {
      console.log("❌ Shorten URL error:", error)
      const axiosError = error as AxiosError<ErrorResponse>

      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message)
      } else if (axiosError.response?.status === 400) {
        throw new Error("Please provide a valid URL")
      } else if (axiosError.response?.status === 401) {
        throw new Error("Please login to shorten URLs")
      } else if (axiosError.message) {
        throw new Error(axiosError.message)
      } else {
        throw new Error("Failed to shorten URL. Please try again.")
      }
    }
  },

  getUserUrls: async (): Promise<UrlItem[]> => {
    try {
      const response = await axiosInstance.get<BackendResponse<UrlItem[]>>("/url/my-urls")
      console.log("✅ Get user URLs success:", response.data)
      return response.data.data || []
    } catch (error) {
      console.log("❌ Get user URLs error:", error)
      const axiosError = error as AxiosError<ErrorResponse>

      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message)
      } else if (axiosError.response?.status === 401) {
        throw new Error("Please login to view your URLs")
      } else if (axiosError.message) {
        throw new Error(axiosError.message)
      } else {
        throw new Error("Failed to fetch URLs. Please try again.")
      }
    }
  },

  // Optional: Function to get redirect URL (though this is typically handled by direct navigation)
  getRedirectUrl: async (shortCode: string): Promise<string> => {
    try {
      // Note: This would typically be a direct redirect, but if you need to get the URL programmatically
      const response = await axiosInstance.get(`/url/${shortCode}`, {
        maxRedirects: 0, // Prevent automatic redirect
        validateStatus: (status) => status === 302 || status === 301,
      })

      return response.headers.location || ""
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>

      if (axiosError.response?.status === 404) {
        throw new Error("Short URL not found")
      } else {
        throw new Error("Failed to resolve short URL")
      }
    }
  },
}

export default api
