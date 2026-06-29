import { useState, useEffect } from 'react'
import { sb } from '../lib/supabase'
import { useData } from '../context/DataContext'
import { useToast } from '../context/ToastContext'
import { formatDate, getInitials } from '../lib/utils'
import Spinner from './Spinner'
import ConfirmDialog from './ConfirmDialog'
import Modal from './Modal'
import RecordEditor from './RecordEditor'

export default function StudentProfile({ studentId, onBack, onAddDefault }) {
  const { loadRecordsForStudent, refreshAll } = useData()
  const showToast = useToast()
  const [student, setStudent] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteRecordId, setDeleteRecordId] = useState(null)
  const [confirmDeleteStudent, setConfirmDeleteStudent] = useState(false)
  const [editRecord, setEditRecord] = useState(null)

  useEffect(() => {
    if (!studentId) return
    loadData()
  }, [studentId])

  async function loadData() {
    setLoading(true)
    const { data: s } = await sb.from('students').select('*').eq('id', studentId).single()
    const recs = await loadRecordsForStudent(studentId)
    setStudent(s)
    setRecords(recs)
    setLoading(false)
  }

  async function handleDeleteRecord() {
    const { error } = await sb.from('defaulter_records').delete().eq('id', deleteRecordId)
    if (error) return showToast('Error deleting record.', 'error')
    showToast('Record deleted.', 'success')
    setDeleteRecordId(null)
    const recs = await loadRecordsForStudent(studentId)
    setRecords(recs)
    refreshAll()
  }

  async function handleDeleteStudent() {
    const { error: rErr } = await sb.from('defaulter_records').delete().eq('student_id', studentId)
    if (rErr) return showToast('Error cleaning up records.', 'error')
    const { error: sErr } = await sb.from('students').delete().eq('id', studentId)
    if (sErr) return showToast('Error deleting student.', 'error')
    showToast('Student deleted.', 'success')
    setConfirmDeleteStudent(false)
    refreshAll()
    onBack()
  }

  function handleEditSaved() {
    setEditRecord(null)
    loadData()
  }

  if (loading) return <Spinner />
  if (!student) return null

  const initials = getInitials(student.full_name)

  return (
    <div>
      <div className="card">
        <div className="profile-header">
          <div className="profile-avatar">{initials}</div>
          <div>
            <div className="profile-name">{student.full_name}</div>
            <div className="profile-meta">{student.matric_number} &bull; {student.programme}</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="badge-default">
              {records.length} Default{records.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setConfirmDeleteStudent(true)}
              style={{
                background: 'rgba(192,57,43,0.2)', color: '#E74C3C', border: '1px solid rgba(192,57,43,0.3)',
                borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Delete Student
            </button>
          </div>
        </div>
        <div className="info-grid">
          <div className="info-item"><label>Block</label><span>{student.hostel_block}</span></div>
          <div className="info-item"><label>Room</label><span>{student.room_number}</span></div>
          <div className="info-item"><label>Level</label><span>{student.year_of_study}</span></div>
        </div>
        <div style={{ padding: '20px 24px' }}>
          <div className="section-title">Default Records</div>
          {records.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px' }}>
              <p>No default records found for this student.</p>
            </div>
          ) : (
            records.map(r => (
              <div className="record-item" key={r.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="record-date">{formatDate(r.date_of_default)}</div>
                    <div className="record-tags">
                      {r.nature_of_default.map((t, i) => (
                        <span className="tag" key={i}>{t}</span>
                      ))}
                    </div>
                    {r.description && <div className="record-desc">{r.description}</div>}
                    {r.profiles && (
                      <div style={{ marginTop: 8, fontSize: 11, color: 'var(--gray-400)' }}>
                        Recorded by: {r.profiles.full_name}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => setEditRecord(r)}
                      style={{
                        background: 'var(--navy)', color: 'var(--white)', border: 'none',
                        borderRadius: 4, padding: '4px 10px', fontSize: 11, fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteRecordId(r.id)}
                      style={{
                        background: 'transparent', color: 'var(--red)', border: '1px solid var(--red)',
                        borderRadius: 4, padding: '4px 10px', fontSize: 11, fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="btn-row" style={{ marginTop: '16px' }}>
        <button className="btn-cancel" onClick={onBack}>Back to Search</button>
        <button className="btn-save" onClick={() => onAddDefault(studentId, student.full_name)}>
          Add Default Record
        </button>
      </div>

      <ConfirmDialog
        open={!!deleteRecordId}
        title="Delete Record"
        message="This action cannot be undone. Are you sure you want to delete this default record?"
        onConfirm={handleDeleteRecord}
        onCancel={() => setDeleteRecordId(null)}
        danger
      />

      <ConfirmDialog
        open={confirmDeleteStudent}
        title="Delete Student"
        message={`This will permanently delete "${student.full_name}" and all ${records.length} default record${records.length !== 1 ? 's' : ''}. This cannot be undone.`}
        onConfirm={handleDeleteStudent}
        onCancel={() => setConfirmDeleteStudent(false)}
        danger
      />

      <Modal open={!!editRecord} title="Edit Default Record" onClose={() => setEditRecord(null)}>
        <RecordEditor
          record={editRecord}
          onSave={handleEditSaved}
          onCancel={() => setEditRecord(null)}
        />
      </Modal>
    </div>
  )
}
