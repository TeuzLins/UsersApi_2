import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchUsers, UserDetail } from '../services/userService'

const Users: React.FC = () => {
  const [items, setItems] = useState<UserDetail[]>([])
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    const data = await fetchUsers(page, pageSize, search)
    setItems(data.items)
    setTotal(data.totalCount)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [page, search])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="card">
      <h2>Usuários</h2>
      <div className="toolbar">
        <input
          placeholder="Buscar por nome ou email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.isActive ? 'Ativo' : 'Inativo'}</td>
                <td>
                  <Link to={`/users/${user.id}`}>Detalhes</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="pagination">
        <button className="button secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Anterior
        </button>
        <span>
          Página {page} de {totalPages || 1}
        </span>
        <button className="button secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
          Próxima
        </button>
      </div>
    </div>
  )
}

export default Users
