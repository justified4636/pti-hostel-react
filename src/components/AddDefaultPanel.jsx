import { useState, useEffect, useRef } from 'react'
import { sb } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useData } from '../context/DataContext'
import { DEFAULT_TYPES } from '../lib/constants'

function getDefaultDate() {
  return new Date().toISOString().split('T')[0]
}

export default function AddDefaultPanel({ initialStudentId, initialStudentName, onClearInitial }) {
  const { user } = useAuth()
  const showToast = useToast()
  const { students, refreshAll } = useData()
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudentId || '')
  const [selectedStudentLabel, setSelectedStudentLabel] = useState(initialStudentName || '')
  const [date, setDate] = useState(getDefaultDate())
  const [checkedTypes, setCheckedTypes] = useState({})
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initialStudentId) {
      setSelectedStudentId(initialStudentId)
      setSelectedStudentLabel(initialStudentName)
      onClearInitial?.()
    }
  }, [initialStudentId, initialStudentName])

  function handleSearchChange(e) {
    const q = e.target.value.trim().toLowerCase()
    setSearchQuery(e.target.value)
    setSelectedStudentId('')
    setSelectedStudentLabel('')

    if (!q) { setSuggestions([]); return }

    const matches = students.filter(s =>
      s.full_name.toLowerCase().includes(q) || s.matric_number.toLowerCase().includes(q)
    ).slice(0, 5)
    setSuggestions(matches)
  }

  function selectStudent(student) {
    setSelectedStudentId(student.id)
    setSelectedStudentLabel(`${student.full_name} (${student.matric_number})`)
    setSearchQuery(`${student.full_name} (${student.matric_number})`)
    setSuggestions([])
  }

  function toggleType(type) {
    setCheckedTypes(prev => ({ ...prev, [type]: !prev[type] }))
  }

  function clearForm() {
    setSelectedStudentId('')
    setSelectedStudentLabel('')
    setSearchQuery('')
    setSuggestions([])
    setDescription('')
    setCheckedTypes({})
    setDate(getDefaultDate())
  }

  async function handleSubmit() {
    if (!selectedStudentId) return showToast('Please select a student first.', 'error')
    if (!date) return showToast('Please select the date of default.', 'error')
    const selected = Object.entries(checkedTypes).filter(([, v]) => v).map(([k]) => k)
    if (!selected.length) return showToast('Please select at least one type of default.', 'error')

    setSaving(true)
    const { error } = await sb.from('defaulter_records').insert({
      student_id: selectedStudentId,
      date_of_default: date,
      nature_of_default: selected,
      description: description.trim() || null,
      recorded_by: user.id,
    })
    setSaving(false)

    if (error) return showToast('Error saving record. Please try again.', 'error')
    showToast('Default record saved!', 'success')
    clearForm()
    refreshAll()
  }

  return (
    <div className="card">
      <div className="card-header"><h2>Record New Default</h2></div>
      <div className="card-body">
        <div className="form-grid">
          <div style={{ position: 'relative' }}>
            <label className="field-label">Student (Name or Matric) *</label>
            <input
              className="field-input"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Type to search..."
            />
            {suggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {suggestions.map(s => (
                  <div
                    key={s.id}
                    className="suggestion-item"
                    onClick={() => selectStudent(s)}
                  >
                    <strong>{s.full_name}</strong><br />
                    <span style={{ fontSize: '12px', color: 'var(--gray-400)' }}>
                      {s.matric_number} &bull; {s.hostel_block}/{s.room_number}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {selectedStudentId && (
              <div style={{ marginTop: '6px', fontSize: '13px', color: 'var(--green)', fontWeight: '600' }}>
                ✓ {selectedStudentLabel}
              </div>
            )}
          </div>
          <div>
            <label className="field-label">Date of Default *</label>
            <input className="field-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="full">
            <label className="field-label">Nature of Default * (select all that apply)</label>
            <div className="checkbox-grid">
              {DEFAULT_TYPES.map(type => (
                <label
                  key={type}
                  className={`check-item ${checkedTypes[type] ? 'checked' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={!!checkedTypes[type]}
                    onChange={() => toggleType(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
          <div className="full">
            <label className="field-label">Description / Remarks</label>
            <textarea
              className="field-input"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Additional details about the default..."
            />
          </div>
        </div>
        <div className="btn-row">
          <button className="btn-cancel" onClick={clearForm}>Clear</button>
          <button className="btn-save" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : 'Save Record'}
          </button>
        </div>
      </div>
    </div>
  )
}
