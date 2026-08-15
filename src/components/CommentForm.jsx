import { useState } from 'react'
import { supabase } from '../supabase'

function CommentForm({ onSuccess, onError }) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim() || !content.trim()) {
      onError('Lütfen adınızı ve yorumunuzu yazın.')
      return
    }

    setLoading(true)

    const { error } = await supabase.from('comments').insert([
      {
        name: name.trim(),
        content: content.trim(),
      },
    ])

    if (error) {
      onError('Yorum gönderilirken bir hata oluştu.')
    } else {
      setName('')
      setContent('')
      onSuccess()
    }

    setLoading(false)
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Adınız"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={50}
        className="comment-input"
      />

      <textarea
        placeholder="Yorumunuzu yazın..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={1000}
        className="comment-textarea"
      />

      <button type="submit" disabled={loading} className="comment-submit">
        {loading ? 'Gönderiliyor...' : 'Yorum Gönder'}
      </button>
    </form>
  )
}

export default CommentForm