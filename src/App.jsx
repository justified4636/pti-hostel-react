import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import { DataProvider, useData } from './context/DataContext'
import LoginPage from './components/LoginPage'
import Topbar from './components/Topbar'
import StatsRow from './components/StatsRow'
import Tabs from './components/Tabs'
import SearchPanel from './components/SearchPanel'
import AddStudentPanel from './components/AddStudentPanel'
import AddDefaultPanel from './components/AddDefaultPanel'
import StudentProfile from './components/StudentProfile'
import AdminPanel from './components/AdminPanel'
import RealtimeListener from './components/RealtimeListener'
import ErrorBoundary from './components/ErrorBoundary'

const LOGO_URL = '/pti-logo.png'

function AppContent() {
  const { user, profile, loading } = useAuth()
  const { refreshAll } = useData()
  const [activeTab, setActiveTab] = useState('search')
  const [profileStudentId, setProfileStudentId] = useState(null)
  const [prefilledStudent, setPrefilledStudent] = useState(null)

  function handleSelectStudent(id) {
    setProfileStudentId(id)
    setActiveTab('profile')
  }

  function handleAddDefaultFromProfile(id, name) {
    setPrefilledStudent({ id, name })
    setActiveTab('add-default')
  }

  function handleClearPrefilled() {
    setPrefilledStudent(null)
  }

  if (loading) return null
  if (!user) return <LoginPage logoUrl={LOGO_URL} />

  return (
    <div className="app-shell">
      <RealtimeListener onRefresh={refreshAll} />
      <Topbar logoUrl={LOGO_URL} />
      <div className="main">
        {activeTab !== 'profile' && <StatsRow />}
        {activeTab !== 'profile' && (
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        )}

        {activeTab === 'search' && (
          <SearchPanel onSelectStudent={handleSelectStudent} />
        )}

        {activeTab === 'add-student' && (
          <AddStudentPanel />
        )}

        {activeTab === 'add-default' && (
          <AddDefaultPanel
            initialStudentId={prefilledStudent?.id}
            initialStudentName={prefilledStudent?.name}
            onClearInitial={handleClearPrefilled}
          />
        )}

        {activeTab === 'profile' && (
          <StudentProfile
            studentId={profileStudentId}
            onBack={() => setActiveTab('search')}
            onAddDefault={handleAddDefaultFromProfile}
          />
        )}

        {activeTab === 'admin' && profile?.role === 'admin' && (
          <AdminPanel />
        )}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ErrorBoundary>
  )
}
