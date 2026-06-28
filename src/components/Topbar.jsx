import { useAuth } from '../context/AuthContext'

export default function Topbar({ logoUrl }) {
  const { profile, user, logout } = useAuth()

  return (
    <div className="topbar">
      <div className="topbar-brand">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" style={{ width: 24, height: 24, objectFit: 'contain', flexShrink: 0 }} />
        ) : (
          <div className="dot"></div>
        )}
        PTI Defaulters
      </div>
      <div className="topbar-right">
        <span className="porter-badge">{profile?.full_name || user?.email}</span>
        <button className="btn-logout" onClick={logout}>Logout</button>
      </div>
    </div>
  )
}
