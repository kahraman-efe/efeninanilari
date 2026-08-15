import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Giriş bilgileri hatalı.')
      setLoading(false)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleLogin}>
        <h1>Efe'nin Anıları</h1>
        <p>Yönetici Girişi</p>

        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="admin-login-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
    </div>
  )
}

export default AdminLogin