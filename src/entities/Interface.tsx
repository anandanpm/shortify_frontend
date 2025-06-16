
 export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
}

export interface User {
  success: any
  data: any
  id: string
  name: string
  email: string
}

export interface LoginResponse {
  success: any
  data: any
  user: User
  token: string
}

export interface UrlData {
  id: string
  originalUrl: string
  shortUrl: string
  shortCode: string
  createdAt: string
}


export interface UrlItem {
  id: string
  originalUrl: string
  shortUrl: string
  shortCode: string
  createdAt: string
}

export interface UrlState {
  urls: UrlItem[]
  loading: boolean
  error: string | null
  totalUrls: number
  shorteningInProgress: boolean 
}




export interface User {
  id: string
  name: string
  email: string
}

export interface UserState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  isInitialized: boolean
}
