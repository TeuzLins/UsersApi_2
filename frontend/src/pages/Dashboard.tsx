import React from 'react'
import { useAuth } from '../hooks/useAuth'

const Dashboard: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="card">
      <h2>Olá, {user?.name}</h2>
      <p>Seu perfil atual é: <strong>{user?.role}</strong></p>
      <p>Use o menu para navegar entre as funcionalidades disponíveis.</p>
    </div>
  )
}

export default Dashboard
