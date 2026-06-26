import { useAuth } from '../context/AuthContext'

export default function Topbar() {
  const { profile, user, logout } = useAuth()

  return (
    <div className="topbar">
      <div className="topbar-brand">
        <div className="dot"></div>
        PTI Hostel Defaulters
      </div>
      <div className="topbar-right">
        <span className="porter-badge">
          {profile?.full_name || user?.email}
        </span>
        <button className="btn-logout" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  )
}
