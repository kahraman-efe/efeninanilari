import { useState } from 'react'

const PAGE_SIZE = 20

function CommentList({ comments }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const visibleComments = comments.slice(0, visibleCount)
  const hasMore = visibleCount < comments.length

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }) + ' • ' + date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (comments.length === 0) {
    return <p className="comments-empty">Henüz yorum yok. İlk yorumu sen yaz!</p>
  }

  return (
    <div className="comments-list">
      {visibleComments.map((comment) => (
        <article className="comment-card" key={comment.id}>
          <div className="comment-header">
            <span className="comment-name">{comment.name}</span>
          </div>
          <p className="comment-content">{comment.content}</p>
          <span className="comment-date">{formatDate(comment.created_at)}</span>
        </article>
      ))}

      {hasMore && (
        <button
          className="load-more-button"
          onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
        >
          Daha fazla yorum
        </button>
      )}
    </div>
  )
}

export default CommentList