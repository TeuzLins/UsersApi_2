import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user, logout } = useAuth()

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1>UsersApi</h1>
          <p>Gerenciamento de usuários</p>
        </div>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Perfil</Link>
          {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && <Link to="/users">Usuários</Link>}
          {user?.role === 'ADMIN' && <Link to="/admin">Admin</Link>}
          <button className="button secondary" onClick={() => logout()}>
            Sair
          </button>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}

export default Layout
