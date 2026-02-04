import React, { useEffect, useState } from 'react'
import { createUser, deleteUser, fetchUsers, updateUserRole, updateUserStatus, UserDetail } from '../services/userService'

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<UserDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' })

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await fetchUsers(1, 20, '')
      setUsers(data.items)
    } catch {
      setError('Erro ao carregar usuários.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    try {
      await createUser(form)
      setForm({ name: '', email: '', password: '', role: 'USER' })
      await loadUsers()
    } catch {
      setError('Erro ao criar usuário.')
    }
  }

  const toggleStatus = async (user: UserDetail) => {
    await updateUserStatus(user.id, !user.isActive)
    await loadUsers()
  }

  const changeRole = async (user: UserDetail, role: string) => {
    await updateUserRole(user.id, role)
    await loadUsers()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir?')) return
    await deleteUser(id)
    await loadUsers()
  }

  return (
    <div className="card">
      <h2>Administração</h2>
      <form className="form-grid" onSubmit={handleCreate}>
        <h3>Criar usuário</h3>
        <label>
          Nome
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </label>
        <label>
          Email
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" required />
        </label>
        <label>
          Senha
          <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" required />
        </label>
        <label>
          Role
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="ADMIN">ADMIN</option>
            <option value="MANAGER">MANAGER</option>
            <option value="USER">USER</option>
          </select>
        </label>
        <button className="button" type="submit">Criar</button>
      </form>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select value={user.role} onChange={(e) => changeRole(user, e.target.value)}>
                    <option value="ADMIN">ADMIN</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="USER">USER</option>
                  </select>
                </td>
                <td>{user.isActive ? 'Ativo' : 'Inativo'}</td>
                <td>
                  <button className="button secondary" type="button" onClick={() => toggleStatus(user)}>
                    {user.isActive ? 'Desativar' : 'Ativar'}
                  </button>
                  <button className="button danger" type="button" onClick={() => handleDelete(user.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default AdminPanel
