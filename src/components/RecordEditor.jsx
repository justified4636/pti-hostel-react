import { useState, useEffect } from 'react'
import { sb } from '../lib/supabase'
import { useToast } from '../context/ToastContext'
import { DEFAULT_TYPES } from '../lib/constants'

export default function RecordEditor({ record, onSave, onCancel }) {
  const showToast = useToast()
  const [date, setDate] = useState('')
  const [checkedTypes, setCheckedTypes] = useState({})
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (record) {
      setDate(record.date_of_default)
      setDescription(record.description || '')
      const types = {}
      DEFAULT_TYPES.forEach(t => { types[t] = (record.nature_of_default || []).includes(t) })
      setCheckedTypes(types)
    }
  }, [record])

  function toggleType(type) {
    setCheckedTypes(prev => ({ ...prev, [type]: !prev[type] }))
  }

  async function handleSubmit() {
    if (!date) return showToast('Please select a date.', 'error')
    const selected = Object.entries(checkedTypes).filter(([, v]) => v).map(([k]) => k)
    if (!selected.length) return showToast('Please select at least one default type.', 'error')

    setSaving(true)
    const { error } = await sb
      .from('defaulter_records')
      .update({ date_of_default: date, nature_of_default: selected, description: description.trim() || null })
      .eq('id', record.id)
    setSaving(false)

    if (error) return showToast('Error updating record.', 'error')
    showToast('Record updated!', 'success')
    onSave()
  }

  if (!record) return null

  return (
    <div>
      <div className="form-grid">
        <div>
          <label className="field-label">Date of Default *</label>
          <input className="field-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="full">
          <label className="field-label">Nature of Default *</label>
          <div className="checkbox-grid">
            {DEFAULT_TYPES.map(type => (
              <label key={type} className={`check-item ${checkedTypes[type] ? 'checked' : ''}`}>
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
            placeholder="Additional details..."
          />
        </div>
      </div>
      <div className="btn-row">
        <button className="btn-cancel" onClick={onCancel}>Cancel</button>
        <button className="btn-save" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
