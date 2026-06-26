import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { sb } from '../lib/supabase'

const DataContext = createContext()

export function useData() {
  return useContext(DataContext)
}

export function DataProvider({ children }) {
  const [students, setStudents] = useState([])
  const [records, setRecords] = useState([])
  const [porters, setPorters] = useState([])
  const [stats, setStats] = useState({ students: 0, records: 0, recent: 0 })
  const [refreshKey, setRefreshKey] = useState(0)

  const triggerRefresh = useCallback(() => setRefreshKey(k => k + 1), [])

  async function loadStudents() {
    const { data } = await sb.from('students').select('id, matric_number, full_name, hostel_block, room_number').order('full_name')
    setStudents(data || [])
    return data || []
  }

  async function loadRecordsForStudent(studentId) {
    const { data } = await sb
      .from('defaulter_records')
      .select('*, profiles!recorded_by(full_name)')
      .eq('student_id', studentId)
      .order('date_of_default', { ascending: false })
    return data || []
  }

  async function loadStats() {
    const { count: sc } = await sb.from('students').select('*', { count: 'exact', head: true })
    const { count: rc } = await sb.from('defaulter_records').select('*', { count: 'exact', head: true })
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    const { count: mc } = await sb.from('defaulter_records').select('*', { count: 'exact', head: true }).gte('date_of_default', monthStart)
    setStats({ students: sc || 0, records: rc || 0, recent: mc || 0 })
  }

  async function loadPorters() {
    const { data } = await sb.from('profiles').select('*').order('created_at')
    setPorters(data || [])
  }

  useEffect(() => {
    loadStudents()
    loadStats()
    loadPorters()
  }, [refreshKey])

  return (
    <DataContext.Provider value={{
      students,
      records,
      porters,
      stats,
      loadStudents,
      loadRecordsForStudent,
      loadStats,
      loadPorters,
      refreshAll: triggerRefresh,
    }}>
      {children}
    </DataContext.Provider>
  )
}
