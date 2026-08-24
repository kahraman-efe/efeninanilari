import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import MainNav from '../components/MainNav'
import VideoGallery from '../components/VideoGallery'
import VideoPlayerModal from '../components/VideoPlayerModal'
import '../App.css'

function Videos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState(null)

  const fetchVideos = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.error('Videolar alınamadı:', error)
    } else {
      setVideos(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  return (
    <main>
      <header>
        <h1>Efe'nin Anıları</h1>
        <div className="header-actions">
          <MainNav />
        </div>
      </header>

      <section className="videos-intro">
        <h2>🎥 Video Anılarım</h2>
        <p>Fotoğrafların anlatamadığı anılar.</p>
      </section>

      {loading ? (
        <p className="videos-loading">Yükleniyor...</p>
      ) : (
        <VideoGallery videos={videos} onSelect={setSelectedVideo} />
      )}

      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </main>
  )
}

export default Videos
