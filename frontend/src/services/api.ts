import axios, { AxiosError } from 'axios'
import { getTokens, setTokens, clearTokens } from './tokenStorage'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
})

api.interceptors.request.use((config) => {
  const tokens = getTokens()
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`
  }
  return config
})

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config
    if (!original || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    const tokens = getTokens()
    if (!tokens?.refreshToken) {
      clearTokens()
      return Promise.reject(error)
    }

    if (!isRefreshing) {
      isRefreshing = true
      refreshPromise = api
        .post('/auth/refresh', { refreshToken: tokens.refreshToken })
        .then((res) => {
          const { accessToken, refreshToken } = res.data
          setTokens({ accessToken, refreshToken })
          return accessToken
        })
        .catch(() => {
          clearTokens()
          return null
        })
        .finally(() => {
          isRefreshing = false
        })
    }

    const newToken = await refreshPromise
    if (!newToken) {
      return Promise.reject(error)
    }

    original.headers = original.headers ?? {}
    original.headers.Authorization = `Bearer ${newToken}`
    return api(original)
  }
)

export default api
