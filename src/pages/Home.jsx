import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import CommentForm from '../components/CommentForm'
import CommentList from '../components/CommentList'
import Toast from '../components/Toast'
import '../App.css'

function Home() {
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [comments, setComments] = useState([])
  const [toast, setToast] = useState(null)

  const photos = Array.from(
    { length: 204 },
    (_, i) => `/anilar/foto${i + 1}.png`
  )

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Yorumlar alınamadı:', error)
      return
    }

    setComments(data)
  }

  useEffect(() => {
    fetchComments()
  }, [])

  const openPhoto = (index) => setSelectedPhoto(index)
  const closePhoto = () => setSelectedPhoto(null)
  const nextPhoto = () => setSelectedPhoto((c) => (c + 1) % photos.length)
  const previousPhoto = () =>
    setSelectedPhoto((c) => (c - 1 + photos.length) % photos.length)

  return (
    <main>
      <header>
        <h1>Efe'nin Anıları</h1>
        <button
          className="comments-button"
          onClick={() =>
            document.getElementById('comments').scrollIntoView({ behavior: 'smooth' })
          }
        >
          Yorumlar ↓
        </button>
      </header>

      <section className="gallery">
        {photos.map((photo, index) => (
          <button className="photo-card" key={photo} onClick={() => openPhoto(index)}>
            <img src={photo} alt={`Anı ${index + 1}`} />
          </button>
        ))}
      </section>

      {selectedPhoto !== null && (
        <div className="lightbox" onClick={closePhoto}>
          <button className="close-button" onClick={closePhoto}>×</button>
          <button
            className="navigation previous"
            onClick={(e) => { e.stopPropagation(); previousPhoto() }}
          >‹</button>
          <img
            className="lightbox-image"
            src={photos[selectedPhoto]}
            alt={`Anı ${selectedPhoto + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="navigation next"
            onClick={(e) => { e.stopPropagation(); nextPhoto() }}
          >›</button>
        </div>
      )}

      <section id="comments" className="comments-section">
        <h2>Yorumlar</h2>
        <p className="comments-subtitle">Bu anılar hakkında ne düşünüyorsun?</p>

        <CommentForm
          onSuccess={() => {
            fetchComments()
            setToast({ message: 'Yorumun eklendi, teşekkürler!', type: 'success' })
          }}
          onError={(msg) => setToast({ message: msg, type: 'error' })}
        />

        <CommentList comments={comments} />
      </section>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  )
}

export default Home