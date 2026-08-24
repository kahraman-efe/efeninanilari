function VideoPlayerModal({ video, onClose }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR')
  }

  return (
    <div className="video-lightbox" onClick={onClose}>
      <button className="close-button" onClick={onClose}>×</button>
      <div className="video-player-wrapper" onClick={(e) => e.stopPropagation()}>
        <video
          className="video-player"
          src={video.video_url}
          controls
          autoPlay
          playsInline
        />
        <div className="video-player-info">
          <h3>{video.title}</h3>
          {video.date && <span className="video-date">{formatDate(video.date)}</span>}
          {video.description && <p>{video.description}</p>}
        </div>
      </div>
    </div>
  )
}

export default VideoPlayerModal
