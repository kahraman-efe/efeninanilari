import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import ConfirmModal from './ConfirmModal'

const VIDEO_BUCKET = 'videos'

function AdminVideoManager({ onToast }) {
  const [videos, setVideos] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('date', { ascending: false })

    if (!error) setVideos(data)
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setDate('')
    setFile(null)
    setShowForm(false)
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!file || !title.trim()) {
      onToast('Lütfen video dosyası ve başlık girin.', 'error')
      return
    }

    setUploading(true)

    try {
      // Dosya adını benzersizleştir, video/ klasörüne yükle
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`
      const filePath = `videos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(VIDEO_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from(VIDEO_BUCKET)
        .getPublicUrl(filePath)

      const { error: insertError } = await supabase.from('videos').insert([
        {
          title: title.trim(),
          description: description.trim() || null,
          video_url: publicUrlData.publicUrl,
          date: date || new Date().toISOString().slice(0, 10),
          storage_path: filePath,
        },
      ])

      if (insertError) throw insertError

      onToast('Video başarıyla yüklendi.', 'success')
      resetForm()
      fetchVideos()
    } catch (err) {
      console.error('Video yükleme hatası:', err)
      onToast('Video yüklenirken bir hata oluştu.', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    const video = videos.find((v) => v.id === deleteTarget)
    if (!video) {
      setDeleteTarget(null)
      return
    }

    try {
      if (video.storage_path) {
        const { error: storageError } = await supabase.storage
          .from(VIDEO_BUCKET)
          .remove([video.storage_path])

        if (storageError) {
          console.error('Storage silme hatası:', storageError)
        }
      }

      const { error: dbError } = await supabase
        .from('videos')
        .delete()
        .eq('id', video.id)

      if (dbError) throw dbError

      onToast('Video silindi.', 'success')
      fetchVideos()
    } catch (err) {
      console.error('Video silinemedi:', err)
      onToast('Video silinemedi: yetkin olmayabilir.', 'error')
    }

    setDeleteTarget(null)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR')
  }

  return (
    <div className="admin-videos-section">
      <div className="admin-videos-header">
        <h2>🎥 Videolar</h2>
        <button
          className="admin-add-video-btn"
          onClick={() => setShowForm((s) => !s)}
        >
          {showForm ? 'Vazgeç' : '+ Video Ekle'}
        </button>
      </div>

      {showForm && (
        <form className="admin-video-form" onSubmit={handleUpload}>
          <label>
            Video Dosyası
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          <label>
            Başlık
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Video başlığı"
              maxLength={100}
            />
          </label>

          <label>
            Açıklama
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kısa açıklama (opsiyonel)"
              maxLength={500}
            />
          </label>

          <label>
            Tarih
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <button type="submit" disabled={uploading} className="admin-upload-btn">
            {uploading ? 'Yükleniyor...' : 'Yükle'}
          </button>
        </form>
      )}

      <div className="admin-video-table">
        {videos.length === 0 ? (
          <p className="videos-empty">Henüz video eklenmemiş.</p>
        ) : (
          videos.map((video) => (
            <div className="admin-video-row" key={video.id}>
              <div>
                <strong>{video.title}</strong>
                <span className="admin-video-date">{formatDate(video.date)}</span>
              </div>
              <button
                className="admin-delete-btn"
                onClick={() => setDeleteTarget(video.id)}
              >
                Sil
              </button>
            </div>
          ))
        )}
      </div>

      {deleteTarget && (
        <ConfirmModal
          message="Bu videoyu silmek istediğine emin misin?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

export default AdminVideoManager
