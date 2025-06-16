


import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { type UrlState, type UrlItem, } from "../../entities/Interface"

const initialState: UrlState = {
  urls: [],
  loading: false,
  error: null,
  totalUrls: 0,
  shorteningInProgress: false,
}

const urlSlice = createSlice({
  name: "urls",
  initialState,
  reducers: {
    setUrlsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },

    setShorteningLoading: (state, action: PayloadAction<boolean>) => {
      state.shorteningInProgress = action.payload
    },

    setUrlsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
      state.shorteningInProgress = false
    },

    clearUrlsError: (state) => {
      state.error = null
    },

    setUrls: (state, action: PayloadAction<UrlItem[]>) => {
      state.urls = action.payload
      state.totalUrls = action.payload.length
      state.loading = false
      state.error = null
    },

    addUrl: (state, action: PayloadAction<UrlItem>) => {
      // Check if URL already exists to prevent duplicates
      const existingIndex = state.urls.findIndex((url) => url.shortCode === action.payload.shortCode)

      if (existingIndex !== -1) {
        // Update existing URL
        state.urls[existingIndex] = action.payload
      } else {
        // Add new URL to the beginning of the array
        state.urls.unshift(action.payload)
      }

      state.totalUrls = state.urls.length
      state.shorteningInProgress = false
      state.error = null
    },

    removeUrl: (state, action: PayloadAction<string>) => {
      state.urls = state.urls.filter((url) => url.id !== action.payload)
      state.totalUrls = state.urls.length
    },

    updateUrl: (state, action: PayloadAction<Partial<UrlItem> & { id: string }>) => {
      const index = state.urls.findIndex((url) => url.id === action.payload.id)
      if (index !== -1) {
        state.urls[index] = { ...state.urls[index], ...action.payload }
      }
    },

    clearUrls: (state) => {
      state.urls = []
      state.totalUrls = 0
      state.loading = false
      state.error = null
      state.shorteningInProgress = false
    },

    // Additional helper actions
    incrementUrlClicks: (state, action: PayloadAction<string>) => {
      const url = state.urls.find((url) => url.id === action.payload)
      if (url && "clicks" in url) {
        ;(url as any).clicks += 1
      }
    },
  },
})

export const {
  setUrlsLoading,
  setShorteningLoading,
  setUrlsError,
  clearUrlsError,
  setUrls,
  addUrl,
  removeUrl,
  updateUrl,
  clearUrls,
  incrementUrlClicks,
} = urlSlice.actions

export default urlSlice.reducer
