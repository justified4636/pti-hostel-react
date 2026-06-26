import { useEffect } from 'react'
import { sb } from '../lib/supabase'

export default function RealtimeListener({ onRefresh }) {
  useEffect(() => {
    const studentsChannel = sb.channel('students-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => onRefresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'defaulter_records' }, () => onRefresh())
      .subscribe()

    return () => {
      sb.removeChannel(studentsChannel)
    }
  }, [onRefresh])

  return null
}
