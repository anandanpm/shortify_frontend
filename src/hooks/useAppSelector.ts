import { useSelector, type TypedUseSelectorHook } from "react-redux"
import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "../redux/store"

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

const selectUserState = createSelector([(state: RootState) => state.user], (userSlice) => {
  console.log("Selector - Raw user slice:", userSlice)

  if (!userSlice) {
    return {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      isInitialized: false,
    }
  }

  const result = {
    user: userSlice.user || null,
    isAuthenticated: Boolean(userSlice.isAuthenticated),
    loading: Boolean(userSlice.loading),
    error: userSlice.error || null,
    isInitialized: Boolean(userSlice.isInitialized), // ✅ Added missing isInitialized
  }

  console.log("Selector - Processed result:", result)
  return result
})

// ✅ Fixed: Using state.urls (plural) as confirmed by TypeScript error
const selectUrlsState = createSelector([(state: RootState) => state.urls], (urlSlice) => {
  console.log("Selector - Raw urls slice:", urlSlice)
  
  if (!urlSlice) {
    return {
      urls: [],
      loading: false,
      error: null,
      totalUrls: 0,
      shorteningInProgress: false,
    }
  }

  const result = {
    urls: Array.isArray(urlSlice.urls) ? urlSlice.urls : [],
    loading: Boolean(urlSlice.loading),
    error: urlSlice.error || null,
    totalUrls: Number(urlSlice.totalUrls) || 0,
    shorteningInProgress: Boolean(urlSlice.shorteningInProgress),
  }

  console.log("Selector - Processed urls result:", result)
  return result
})

const selectAuthStatus = createSelector([(state: RootState) => state.user], (userSlice) => {
  if (!userSlice) {
    return {
      isAuthenticated: false,
      isLoading: false,
      hasUser: false,
      isInitialized: false,
    }
  }

  return {
    isAuthenticated: Boolean(userSlice.isAuthenticated),
    isLoading: Boolean(userSlice.loading),
    hasUser: Boolean(userSlice.user),
    isInitialized: Boolean(userSlice.isInitialized), // ✅ Added isInitialized here too
  }
})

// Custom hooks using memoized selectors
export const useUserState = () => {
  const state = useAppSelector(selectUserState)
  console.log("useUserState hook returning:", {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    isInitialized: state.isInitialized,
  })
  return state
}

export const useUrlsState = () => {
  const state = useAppSelector(selectUrlsState)
  console.log("useUrlsState hook returning:", {
    urls: state.urls?.length || 0,
    loading: state.loading,
    error: state.error,
    totalUrls: state.totalUrls,
    shorteningInProgress: state.shorteningInProgress,
  })
  return state
}

// Hook to check authentication status
export const useAuthStatus = () => {
  const state = useAppSelector(selectAuthStatus)
  console.log("useAuthStatus hook returning:", state)
  return state
}