import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import './App.css'

function App() {
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [comments, setComments] = useState([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const photos = Array.from(
    { length: 173 },
    (_, i) => `/anilar/foto${i + 1}.png`
  )

  // Supabase'den yorumları getir
  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Yorumlar alınamadı:', error)
      return
    }

    setComments(data)
  }

  // Sayfa açıldığında yorumları getir
  useEffect(() => {
    fetchComments()
  }, [])

  // Yorum gönder
  const addComment = async (e) => {
    e.preventDefault()

    if (!name.trim() || !content.trim()) {
      alert('Lütfen adınızı ve yorumunuzu yazın.')
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from('comments')
      .insert([
        {
          name: name.trim(),
          content: content.trim(),
        },
      ])

    if (error) {
      console.error('Yorum gönderilemedi:', error)
      alert('Yorum gönderilirken bir hata oluştu.')
    } else {
      setName('')
      setContent('')
      await fetchComments()
    }

    setLoading(false)
  }

  const openPhoto = (index) => {
    setSelectedPhoto(index)
  }

  const closePhoto = () => {
    setSelectedPhoto(null)
  }

  const nextPhoto = () => {
    setSelectedPhoto(
      (current) => (current + 1) % photos.length
    )
  }

  const previousPhoto = () => {
    setSelectedPhoto(
      (current) =>
        (current - 1 + photos.length) % photos.length
    )
  }

  return (
    <main>
      <header>
        <h1>Efe'nin Anıları</h1>

        <button
          className="comments-button"
          onClick={() =>
            document
              .getElementById('comments')
              .scrollIntoView({ behavior: 'smooth' })
          }
        >
          Yorumlar ↓
        </button>
      </header>

      {/* FOTOĞRAFLAR */}

      <section className="gallery">
        {photos.map((photo, index) => (
          <button
            className="photo-card"
            key={photo}
            onClick={() => openPhoto(index)}
          >
            <img
              src={photo}
              alt={`Anı ${index + 1}`}
            />
          </button>
        ))}
      </section>

      {/* BÜYÜK FOTOĞRAF */}

      {selectedPhoto !== null && (
        <div
          className="lightbox"
          onClick={closePhoto}
        >
          <button
            className="close-button"
            onClick={closePhoto}
          >
            ×
          </button>

          <button
            className="navigation previous"
            onClick={(e) => {
              e.stopPropagation()
              previousPhoto()
            }}
          >
            ‹
          </button>

          <img
            className="lightbox-image"
            src={photos[selectedPhoto]}
            alt={`Anı ${selectedPhoto + 1}`}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="navigation next"
            onClick={(e) => {
              e.stopPropagation()
              nextPhoto()
            }}
          >
            ›
          </button>
        </div>
      )}

      {/* YORUMLAR */}

      <section
        id="comments"
        className="comments-section"
      >
        <h2>Yorumlar</h2>

        <p>
          Bu anılar hakkında ne düşünüyorsun?
        </p>

        <form
          className="comment-box"
          onSubmit={addComment}
        >
          <input
            type="text"
            placeholder="Adınız"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
          />

          <textarea
            placeholder="Yorumunuzu yazın..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={1000}
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Gönderiliyor...'
              : 'Yorum Gönder'}
          </button>
        </form>

        {/* KAYITLI YORUMLAR */}

        <div className="comments-list">
          {comments.map((comment) => (
            <article
              className="comment"
              key={comment.id}
            >
              <strong>{comment.name}</strong>

              <p>{comment.content}</p>

              <small>
                {new Date(
                  comment.created_at
                ).toLocaleString('tr-TR')}
              </small>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App