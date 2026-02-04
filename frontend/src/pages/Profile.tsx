import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { updateProfile } from '../services/userService'

const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!user) return
    setLoading(true)
    setMessage('')
    setError('')
    try {
      await updateProfile(user.id, { name, email })
      await refreshUser()
      setMessage('Perfil atualizado com sucesso!')
    } catch {
      setError('Falha ao atualizar o perfil.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>Meu perfil</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Nome
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </label>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </form>
    </div>
  )
}

export default Profile
