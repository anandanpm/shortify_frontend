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
      return rejectWithValue(error.message)
    }
  }
)

export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const user = await api.login(email, password)
      return user
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
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
    // ✅ Remove manual setLoading - let async thunks handle it
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      console.log("Error set in state:", action.payload)
    },

    clearError: (state) => {
      state.error = null
      console.log("Error cleared from state")
    },

    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
      state.error = null
      state.isInitialized = true
    },

    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      state.isInitialized = true
    },

    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (!state.user) return
      state.user = { ...state.user, ...action.payload }
    },

    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload
    },

    resetUserState: () => initialState,
  },
  extraReducers: (builder) => {
    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
        console.log("Register pending - loading started")
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false // ✅ Make sure to set loading to false
        state.error = null
        state.isInitialized = true
        console.log("Register fulfilled - user registered and logged in:", action.payload)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false // ✅ Make sure to set loading to false
        state.error = action.payload as string
        state.isAuthenticated = false
        state.user = null
        state.isInitialized = true
        console.log("Register rejected with error:", action.payload)
      })

    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
        console.log("Login pending - loading started")
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false // ✅ Make sure to set loading to false
        state.error = null
        state.isInitialized = true
        console.log("Login fulfilled - user logged in:", action.payload)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false // ✅ Make sure to set loading to false
        state.error = action.payload as string
        state.isAuthenticated = false
        state.user = null
        state.isInitialized = true
        console.log("Login rejected with error:", action.payload)
      })

    // Logout user
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true
        state.error = null
        console.log("Logout pending - loading started")
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.loading = false // ✅ Make sure to set loading to false
        state.error = null
        state.isInitialized = true
        console.log("Logout fulfilled")
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false // ✅ Make sure to set loading to false
        state.error = action.payload as string
        // ✅ Even if logout fails, clear user state for security
        state.user = null
        state.isAuthenticated = false
        state.isInitialized = true
        console.log("Logout rejected with error:", action.payload)
      })

    // Refresh token
    builder
      .addCase(refreshUserToken.pending, (state) => {
        state.loading = true
        state.error = null
        console.log("Refresh token pending - loading started")
      })
      .addCase(refreshUserToken.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false // ✅ Make sure to set loading to false
        state.error = null
        state.isInitialized = true
        console.log("Refresh token fulfilled")
      })
      .addCase(refreshUserToken.rejected, (state, action) => {
        state.loading = false // ✅ Make sure to set loading to false
        state.error = action.payload as string
        state.isAuthenticated = false
        state.user = null
        state.isInitialized = true
        console.log("Refresh token rejected with error:", action.payload)
      })
  },
})

export const {
  setError,
  clearError,
  loginSuccess,
  logout,
  updateUserProfile,
  setInitialized,
  resetUserState,
} = userSlice.actions

export default userSlice.reducer