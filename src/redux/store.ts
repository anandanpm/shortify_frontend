import { configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { combineReducers } from "@reduxjs/toolkit"
import { 
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

import userReducer from "../redux/slices/userSlice"
import urlReducer from "../redux/slices/urlSlice"

// ✅ Fixed: More specific persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // Only persist user state, not urls
  // ✅ Add these options to prevent serialization issues
  serialize: true,
  deserialize: true,
}

const rootReducer = combineReducers({
  user: userReducer,
  urls: urlReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ✅ Fixed: Include all redux-persist action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // ✅ Also ignore serializable check for persisted state paths
        ignoredPaths: ['register', '_persist'],
      },
    }),
  devTools: import.meta.env.NODE_ENV !== "production",
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch