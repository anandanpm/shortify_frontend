
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
    }
  }

  const result = {
    user: userSlice.user || null,
    isAuthenticated: Boolean(userSlice.isAuthenticated && userSlice.user?.id),
    loading: Boolean(userSlice.loading),
    error: userSlice.error || null,
  }

  console.log("Selector - Processed result:", result)
  return result
})

const selectUrlsState = createSelector([(state: RootState) => state.urls], (urlsSlice) => {
  if (!urlsSlice) {
    return {
      urls: [],
      loading: false,
      error: null,
      totalUrls: 0,
      shorteningInProgress: false,
    }
  }

  return {
    urls: Array.isArray(urlsSlice.urls) ? urlsSlice.urls : [],
    loading: Boolean(urlsSlice.loading),
    error: urlsSlice.error || null,
    totalUrls: Number(urlsSlice.totalUrls) || 0,
    shorteningInProgress: Boolean(urlsSlice.shorteningInProgress),
  }
})

const selectAuthStatus = createSelector([(state: RootState) => state.user], (userSlice) => {
  if (!userSlice) {
    return {
      isAuthenticated: false,
      isLoading: false,
      hasUser: false,
    }
  }

  return {
    isAuthenticated: Boolean(userSlice.isAuthenticated && userSlice.user?.id),
    isLoading: Boolean(userSlice.loading),
    hasUser: Boolean(userSlice.user),
  }
})

// Custom hooks using memoized selectors
export const useUserState = () => {
  const state = useAppSelector(selectUserState)
  console.log("useUserState hook returning:", state)
  return state
}

export const useUrlsState = () => {
  return useAppSelector(selectUrlsState)
}

// Hook to check authentication status
export const useAuthStatus = () => {
  return useAppSelector(selectAuthStatus)
}
