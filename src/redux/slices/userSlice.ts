import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import api from "../../services/api.tsx"

interface User {
  id: string
  name: string
  email: string
}

interface UserState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  isInitialized: boolean
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isInitialized: false,
}

// Async thunks for API calls
export const registerUser = createAsyncThunk(
  "user/register",
  async ({ name, email, password }: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const user = await api.register(name, email, password)
      return user
    } catch (error: any) {
      return rejectWithValue(error.message || "Registration failed")
    }
  },
)

export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      console.log("loginUser thunk called with:", { email })
      const user = await api.login(email, password)
      console.log("loginUser thunk successful:", user)
      return user
    } catch (error: any) {
      console.log("loginUser thunk error:", error.message)
      return rejectWithValue(error.message || "Login failed")
    }
  },
)

export const logoutUser = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
  try {
    await api.logout()
    return true
  } catch (error: any) {
    return rejectWithValue(error.message || "Logout failed")
  }
})

export const refreshUserToken = createAsyncThunk("user/refreshToken", async (_, { rejectWithValue }) => {
  try {
    const user = await api.refreshToken()
    return user
  } catch (error: any) {
    return rejectWithValue(error.message || "Token refresh failed")
  }
})

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      if (!state) return initialState
      state.loading = action.payload
    },

    setError: (state, action: PayloadAction<string | null>) => {
      if (!state) return { ...initialState, error: action.payload }
      state.error = action.payload
      state.loading = false
      console.log("Error set in state:", action.payload)
    },

    clearError: (state) => {
      if (!state) return initialState
      state.error = null
      console.log("Error cleared from state")
    },

    // Manual login success (for cases where you don't use async thunk)
    loginSuccess: (state, action: PayloadAction<User>) => {
      if (!state) return { ...initialState, user: action.payload, isAuthenticated: true, isInitialized: true }
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
      state.error = null
      state.isInitialized = true
    },

    // Manual logout (for cases where you don't use async thunk)
    logout: (state) => {
      if (!state) return initialState
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
    },

    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (!state || !state.user) return state
      state.user = { ...state.user, ...action.payload }
    },

    setInitialized: (state, action: PayloadAction<boolean>) => {
      if (!state) return { ...initialState, isInitialized: action.payload }
      state.isInitialized = action.payload
    },

    // Reset state to initial state
    resetUserState: () => initialState,
  },
  extraReducers: (builder) => {
    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        if (!state) return { ...initialState, loading: true }
        state.loading = true
        state.error = null
        console.log("Register pending - setting loading to true")
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        if (!state) return {
          ...initialState,
          user: action.payload,
          isAuthenticated: true,
          isInitialized: true,
        }
        // This was the missing part - you need to set the user data!
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
        state.error = null
        state.isInitialized = true
        console.log("Register fulfilled - user registered and logged in:", action.payload)
      })
      .addCase(registerUser.rejected, (state, action) => {
        if (!state) return { ...initialState, error: action.payload as string }
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
        state.user = null
        console.log("Register rejected with error:", action.payload)
      })

    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        if (!state) return { ...initialState, loading: true }
        state.loading = true
        state.error = null
        console.log("Login pending - clearing error")
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        if (!state)
          return {
            ...initialState,
            user: action.payload,
            isAuthenticated: true,
            isInitialized: true,
          }
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
        state.error = null
        state.isInitialized = true
        console.log("Login fulfilled - user logged in")
      })
      .addCase(loginUser.rejected, (state, action) => {
        if (!state)
          return {
            ...initialState,
            error: action.payload as string,
          }
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
        state.user = null
        console.log("Login rejected with error:", action.payload)
      })

    // Logout user
    builder
      .addCase(logoutUser.pending, (state) => {
        if (!state) return { ...initialState, loading: true }
        state.loading = true
        state.error = null
      })
      .addCase(logoutUser.fulfilled, (state) => {
        if (!state) return initialState
        state.user = null
        state.isAuthenticated = false
        state.loading = false
        state.error = null
      })
      .addCase(logoutUser.rejected, (state, action) => {
        if (!state) return initialState
        state.loading = false
        state.error = action.payload as string
        state.user = null
        state.isAuthenticated = false
      })

    // Refresh token
    builder
      .addCase(refreshUserToken.pending, (state) => {
        if (!state) return { ...initialState, loading: true }
        state.loading = true
        state.error = null
      })
      .addCase(refreshUserToken.fulfilled, (state, action) => {
        if (!state)
          return {
            ...initialState,
            user: action.payload,
            isAuthenticated: true,
            isInitialized: true,
          }
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
        state.error = null
        state.isInitialized = true
      })
      .addCase(refreshUserToken.rejected, (state, action) => {
        if (!state)
          return {
            ...initialState,
            error: action.payload as string,
            isInitialized: true,
          }
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
        state.user = null
        state.isInitialized = true
      })
  },
})

export const {
  setLoading,
  setError,
  clearError,
  loginSuccess,
  logout,
  updateUserProfile,
  setInitialized,
  resetUserState,
} = userSlice.actions

export default userSlice.reducer