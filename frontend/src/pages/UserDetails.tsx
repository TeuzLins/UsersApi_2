const UserDetails: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetchUser(id)
      .then(setUser)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="card">Carregando...</div>
  }

  if (!user) {
    return (
      <div className="card">
        <p>Usuário não encontrado.</p>
        <button className="button" onClick={() => navigate('/users')}>
          Voltar
        </button>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>Detalhes do usuário</h2>
      <div className="details">
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Status:</strong> {user.isActive ? 'Ativo' : 'Inativo'}</p>
      </div>
      <button className="button secondary" onClick={() => navigate('/users')}>
        Voltar
      </button>
    </div>
  )
}

export default UserDetails
