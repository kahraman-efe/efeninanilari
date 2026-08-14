import { useState } from 'react'
import './App.css'

function App() {
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  const photos = Array.from(
    { length: 173 },
    (_, i) => `/anilar/foto${i + 1}.png`
  )

  const openPhoto = (index) => {
    setSelectedPhoto(index)
  }

  const closePhoto = () => {
    setSelectedPhoto(null)
  }

  const nextPhoto = () => {
    setSelectedPhoto((current) => (current + 1) % photos.length)
  }

  const previousPhoto = () => {
    setSelectedPhoto(
      (current) => (current - 1 + photos.length) % photos.length
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

      <section className="gallery">
        {photos.map((photo, index) => (
          <button
            className="photo-card"
            key={photo}
            onClick={() => openPhoto(index)}
          >
            <img src={photo} alt={`Anı ${index + 1}`} />
          </button>
        ))}
      </section>

      {selectedPhoto !== null && (
        <div className="lightbox" onClick={closePhoto}>
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

      <section id="comments" className="comments-section">
        <h2>Yorumlar</h2>

        <p>
          Bu anılar hakkında ne düşünüyorsun?
        </p>

        <div className="comment-box">
          <input
            type="text"
            placeholder="Adınız"
          />

          <textarea
            placeholder="Yorumunuzu yazın..."
          />

          <button>
            Yorum Gönder
          </button>
        </div>
      </section>
    </main>
  )
}

export default App