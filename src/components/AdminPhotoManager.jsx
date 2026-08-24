import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import ConfirmModal from './ConfirmModal'

const PHOTO_BUCKET = 'photos'

function AdminPhotoManager({ onToast }) {
  const [photos, setPhotos] = useState([])
  const [file, setFile] = useState(null)
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setPhotos(data)
  }

  useEffect(() => {
    fetchPhotos()
  }, [])

  const resetForm = () => {
    setFile(null)
    setCaption('')
    setShowForm(false)
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!file) {
      onToast('Lütfen bir fotoğraf seç.', 'error')
      return
    }

    setUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`
      const filePath = `photos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from(PHOTO_BUCKET)
        .getPublicUrl(filePath)

      const { error: insertError } = await supabase.from('photos').insert([
        {
          caption: caption.trim() || null,
          photo_url: publicUrlData.publicUrl,
          storage_path: filePath,
        },
      ])

      if (insertError) throw insertError

      onToast('Fotoğraf başarıyla yüklendi.', 'success')
      resetForm()
      fetchPhotos()
    } catch (err) {
      console.error('Fotoğraf yükleme hatası:', err)
      onToast('Fotoğraf yüklenirken bir hata oluştu.', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    const photo = photos.find((p) => p.id === deleteTarget)
    if (!photo) {
      setDeleteTarget(null)
      return
    }

    try {
      if (photo.storage_path) {
        const { error: storageError } = await supabase.storage
          .from(PHOTO_BUCKET)
          .remove([photo.storage_path])

        if (storageError) {
          console.error('Storage silme hatası:', storageError)
        }
      }

      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photo.id)

      if (dbError) throw dbError

      onToast('Fotoğraf silindi.', 'success')
      fetchPhotos()
    } catch (err) {
      console.error('Fotoğraf silinemedi:', err)
      onToast('Fotoğraf silinemedi: yetkin olmayabilir.', 'error')
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
        <h2>📸 Ek Fotoğraflar</h2>
        <button
          className="admin-add-video-btn"
          onClick={() => setShowForm((s) => !s)}
        >
          {showForm ? 'Vazgeç' : '+ Fotoğraf Ekle'}
        </button>
      </div>

      <p className="admin-section-hint">
        Bu, orijinal 204 fotoğraflık galeriye ek olarak eklenir; mevcut fotoğraflar etkilenmez.
      </p>

      {showForm && (
        <form className="admin-video-form" onSubmit={handleUpload}>
          <label>
            Fotoğraf Dosyası
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          <label>
            Açıklama (opsiyonel)
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Kısa açıklama"
              maxLength={150}
            />
          </label>

          <button type="submit" disabled={uploading} className="admin-upload-btn">
            {uploading ? 'Yükleniyor...' : 'Yükle'}
          </button>
        </form>
      )}

      <div className="admin-video-table">
        {photos.length === 0 ? (
          <p className="videos-empty">Henüz ek fotoğraf eklenmemiş.</p>
        ) : (
          photos.map((photo) => (
            <div className="admin-video-row" key={photo.id}>
              <div className="admin-photo-row-info">
                <img
                  src={photo.photo_url}
                  alt={photo.caption || 'Fotoğraf'}
                  className="admin-photo-thumb"
                />
                <div>
                  <strong>{photo.caption || 'Başlıksız'}</strong>
                  <span className="admin-video-date">{formatDate(photo.created_at)}</span>
                </div>
              </div>
              <button
                className="admin-delete-btn"
                onClick={() => setDeleteTarget(photo.id)}
              >
                Sil
              </button>
            </div>
          ))
        )}
      </div>

      {deleteTarget && (
        <ConfirmModal
          message="Bu fotoğrafı silmek istediğine emin misin?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

export default AdminPhotoManager
