function VideoGallery({ videos, onSelect }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR')
  }

  if (videos.length === 0) {
    return <p className="videos-empty">Henüz video eklenmemiş.</p>
  }

  return (
    <section className="video-gallery">
      {videos.map((video) => (
        <button
          className="video-card"
          key={video.id}
          onClick={() => onSelect(video)}
        >
          <div className="video-thumb-wrapper">
            {/* preload="metadata" ile sadece ilk kare/metadata yüklenir, tüm video indirilmez */}
            <video
              className="video-thumb"
              src={video.video_url}
              preload="metadata"
              muted
              playsInline
            />
            <span className="video-play-icon">▶</span>
          </div>
          <div className="video-card-info">
            <strong>{video.title}</strong>
            {video.date && <span className="video-card-date">{formatDate(video.date)}</span>}
            {video.description && (
              <p className="video-card-desc">{video.description}</p>
            )}
          </div>
        </button>
      ))}
    </section>
  )
}

export default VideoGallery
