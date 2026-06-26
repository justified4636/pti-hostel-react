export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, danger = false }) {
  if (!open) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 24,
    }} onClick={onCancel}>
      <div
        className="card"
        style={{ maxWidth: 400, width: '100%' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="card-header">
          <h2>{title}</h2>
        </div>
        <div className="card-body">
          <p style={{ fontSize: 14, color: 'var(--gray-600)', marginBottom: 24 }}>{message}</p>
          <div className="btn-row" style={{ marginTop: 0 }}>
            <button className="btn-cancel" onClick={onCancel}>Cancel</button>
            <button
              className="btn-save"
              style={{ background: danger ? 'var(--red)' : 'var(--navy)' }}
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
