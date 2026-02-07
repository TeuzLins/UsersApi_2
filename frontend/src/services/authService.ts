import api from './api'
import { Tokens, setTokens, clearTokens } from './tokenStorage'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: string
}

export type AuthResponse = {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export const login = async (email: string, password: string) => {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken })
  return data
}

export const register = async (name: string, email: string, password: string) => {
  const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password })
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken })
  return data
}

export const logout = async (refreshToken: string) => {
  await api.post('/auth/logout', { refreshToken })
  clearTokens()
}

export const fetchMe = async () => {
  const { data } = await api.get<AuthUser>('/auth/me')
  return data
}

export const setAuthTokens = (tokens: Tokens) => {
  setTokens(tokens)
}

export const clearAuthTokens = () => {
  clearTokens()
}
