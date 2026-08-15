function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>Vazgeç</button>
          <button className="modal-confirm" onClick={onConfirm}>Sil</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal