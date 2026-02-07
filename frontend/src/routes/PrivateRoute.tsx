import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const PrivateRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="card">Carregando...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default PrivateRoute
