import { useAuth } from '../context/AuthContext'

export default function Tabs({ activeTab, onTabChange }) {
  const { profile } = useAuth()

  const tabs = [
    { id: 'search', label: 'Search Records' },
    { id: 'add-student', label: 'Add Student' },
    { id: 'add-default', label: 'Add Default' },
    ...(profile?.role === 'admin' ? [{ id: 'admin', label: 'Admin' }] : []),
  ]

  return (
    <div className="tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
