import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const RoleRoute: React.FC<React.PropsWithChildren<{ roles: string[] }>> = ({ roles, children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="card">Carregando...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default RoleRoute
