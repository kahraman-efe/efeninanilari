import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import ConfirmModal from '../components/ConfirmModal'
import Toast from '../components/Toast'

function AdminDashboard() {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)
  const [comments, setComments] = useState([])
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        navigate('/admin/login')
        return
      }

      setSession(session)

      // user_metadata üzerinden admin kontrolü
      const adminFlag = session.user.user_metadata?.is_admin === true
      setIsAdmin(adminFlag)
      setChecking(false)

      if (adminFlag) {
        fetchAllComments()
      }
    }

    checkSession()
  }, [navigate])

  const fetchAllComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setComments(data)
  }

  const handleDelete = async () => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', deleteTarget)

    if (error) {
      setToast({ message: 'Silinemedi: yetkin olmayabilir.', type: 'error' })
    } else {
      setToast({ message: 'Yorum silindi.', type: 'success' })
      fetchAllComments()
    }

    setDeleteTarget(null)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR') + ' ' + date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  }

  if (checking) return <div className="admin-loading">Yükleniyor...</div>

  if (!isAdmin) {
    return (
      <div className="admin-loading">
        Bu hesabın admin yetkisi yok.
        <br />
        <button onClick={handleLogout}>Çıkış Yap</button>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>Efe'nin Anıları</h1>
          <span>Admin Panel</span>
        </div>
        <button onClick={handleLogout}>Çıkış Yap</button>
      </header>

      <div className="admin-stats">
        Toplam Yorum: <strong>{comments.length}</strong>
      </div>

      <div className="admin-comments">
        {comments.map((comment) => (
          <div className="admin-comment-row" key={comment.id}>
            <div>
              <strong>{comment.name}</strong>
              <p>{comment.content}</p>
              <span>{formatDate(comment.created_at)}</span>
            </div>
            <button
              className="admin-delete-btn"
              onClick={() => setDeleteTarget(comment.id)}
            >
              Sil
            </button>
          </div>
        ))}
      </div>

      {deleteTarget && (
        <ConfirmModal
          message="Bu yorumu silmek istediğine emin misin?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default AdminDashboard