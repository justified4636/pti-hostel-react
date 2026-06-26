export default function Modal({ open, title, children, onClose }) {
  if (!open) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 24,
    }} onClick={onClose}>
      <div
        className="card"
        style={{ maxWidth: 520, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="card-header" style={{ justifyContent: 'space-between' }}>
          <h2>{title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 20, color: 'var(--gray-400)', padding: '0 4px',
            }}
          >
            &times;
          </button>
        </div>
        <div className="card-body">{children}</div>
      </div>
    </div>
  )
}
