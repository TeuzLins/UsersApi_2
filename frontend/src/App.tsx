import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import Layout from './components/Layout'
import PrivateRoute from './routes/PrivateRoute'
import RoleRoute from './routes/RoleRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Users from './pages/Users'
import UserDetails from './pages/UserDetails'
import AdminPanel from './pages/AdminPanel'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Layout>
                <Profile />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <RoleRoute roles={["ADMIN", "MANAGER"]}>
              <Layout>
                <Users />
              </Layout>
            </RoleRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <RoleRoute roles={["ADMIN", "MANAGER", "USER"]}>
              <Layout>
                <UserDetails />
              </Layout>
            </RoleRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <RoleRoute roles={["ADMIN"]}>
              <Layout>
                <AdminPanel />
              </Layout>
            </RoleRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
