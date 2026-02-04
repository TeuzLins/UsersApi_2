import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { AuthUser, fetchMe, login as loginRequest, register as registerRequest, logout as logoutRequest } from '../services/authService'
import { getTokens } from '../services/tokenStorage'

type AuthState = {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const tokens = getTokens()
    if (!tokens) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const profile = await fetchMe()
      setUser(profile)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginRequest(email, password)
    setUser(response.user)
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const response = await registerRequest(name, email, password)
    setUser(response.user)
  }, [])

  const logout = useCallback(async () => {
    const tokens = getTokens()
    if (tokens?.refreshToken) {
      await logoutRequest(tokens.refreshToken)
    }
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, loading, login, register, logout, refreshUser }), [user, loading, login, register, logout, refreshUser])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider')
  }
  return context
}
