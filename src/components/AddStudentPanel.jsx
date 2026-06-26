import { useState } from 'react'
import { sb } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useData } from '../context/DataContext'

const initialForm = { matric: '', name: '', programme: '', year: '', block: '', room: '' }

export default function AddStudentPanel() {
  const { user } = useAuth()
  const showToast = useToast()
  const { refreshAll } = useData()
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    const { matric, name, programme, year, block, room } = form
    if (!matric || !name || !programme || !year || !block || !room) {
      return showToast('Please fill in all required fields.', 'error')
    }

    setSaving(true)
    const { error } = await sb.from('students').insert({
      matric_number: matric.toUpperCase(),
      full_name: name,
      programme,
      year_of_study: year,
      hostel_block: block,
      room_number: room,
      created_by: user.id,
    })
    setSaving(false)

    if (error) {
      return showToast(
        error.message.includes('unique') ? 'This matric number already exists.' : 'Error saving student.',
        'error'
      )
    }

    showToast('Student registered successfully!', 'success')
    setForm(initialForm)
    refreshAll()
  }

  function clearForm() {
    setForm(initialForm)
  }

  return (
    <div className="card">
      <div className="card-header"><h2>Register New Student</h2></div>
      <div className="card-body">
        <div className="form-grid">
          <div>
            <label className="field-label">Matric Number *</label>
            <input className="field-input" value={form.matric} onChange={e => setField('matric', e.target.value)} placeholder="e.g. PTI/HND/22/0001" />
          </div>
          <div>
            <label className="field-label">Full Name *</label>
            <input className="field-input" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Surname Firstname Middlename" />
          </div>
          <div>
            <label className="field-label">Programme / Department *</label>
            <input className="field-input" value={form.programme} onChange={e => setField('programme', e.target.value)} placeholder="e.g. Petroleum Engineering" />
          </div>
          <div>
            <label className="field-label">Year of Study *</label>
            <select className="field-input" value={form.year} onChange={e => setField('year', e.target.value)}>
              <option value="">Select year</option>
              <option>ND1</option><option>ND2</option>
              <option>HND1</option><option>HND2</option>
            </select>
          </div>
          <div>
            <label className="field-label">Hostel Block *</label>
            <input className="field-input" value={form.block} onChange={e => setField('block', e.target.value)} placeholder="e.g. Block A" />
          </div>
          <div>
            <label className="field-label">Room Number *</label>
            <input className="field-input" value={form.room} onChange={e => setField('room', e.target.value)} placeholder="e.g. 12B" />
          </div>
        </div>
        <div className="btn-row">
          <button className="btn-cancel" onClick={clearForm}>Clear</button>
          <button className="btn-save" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Registering...' : 'Register Student'}
          </button>
        </div>
      </div>
    </div>
  )
}
