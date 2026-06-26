import { useState } from 'react'
import { sb } from '../lib/supabase'
import { useToast } from '../context/ToastContext'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import ConfirmDialog from './ConfirmDialog'

const initialForm = { name: '', email: '', password: '', role: 'porter' }

export default function AdminPanel() {
  const showToast = useToast()
  const { porters, loadPorters } = useData()
  const { user } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [creating, setCreating] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  async function handleCreate() {
    const { name, email, password, role } = form
    if (!name || !email || !password) return showToast('Please fill in all fields.', 'error')
    if (password.length < 8) return showToast('Password must be at least 8 characters.', 'error')

    setCreating(true)
    const { data, error } = await sb.auth.signUp({ email, password })
    setCreating(false)

    if (error) return showToast(error.message, 'error')

    await sb.from('profiles').insert({ id: data.user.id, full_name: name, role })
    showToast(`Porter account created for ${name}`, 'success')
    setForm(initialForm)
    loadPorters()
  }

  async function handleDeletePorter() {
    if (!deleteTarget) return
    if (deleteTarget === user.id) return showToast('You cannot delete your own account.', 'error')

    const { error } = await sb.from('profiles').delete().eq('id', deleteTarget)
    if (error) return showToast('Error deleting porter account.', 'error')
    showToast('Porter account deleted.', 'success')
    setDeleteTarget(null)
    loadPorters()
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header"><h2>Create Porter Account</h2></div>
        <div className="card-body">
          <div className="admin-warning">
            Only the Admin Porter can create new accounts. Porter accounts can add and edit records.
          </div>
          <div className="form-grid">
            <div>
              <label className="field-label">Full Name *</label>
              <input
                className="field-input"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Porter's full name"
              />
            </div>
            <div>
              <label className="field-label">Email *</label>
              <input
                className="field-input"
                type="email"
                value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="porter@pti.edu.ng"
              />
            </div>
            <div>
              <label className="field-label">Password *</label>
              <input
                className="field-input"
                type="password"
                value={form.password}
                onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Min. 8 characters"
              />
            </div>
            <div>
              <label className="field-label">Role</label>
              <select
                className="field-input"
                value={form.role}
                onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
              >
                <option value="porter">Porter</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="btn-row">
            <button className="btn-save" onClick={handleCreate} disabled={creating}>
              {creating ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h2>Porter Accounts ({porters.length})</h2></div>
        <div className="card-body">
          {porters.length === 0 ? (
            <p style={{ color: 'var(--gray-400)' }}>No porter accounts yet.</p>
          ) : (
            porters.map(p => (
              <div className="porter-row" key={p.id}>
                <div className="porter-info">
                  <div className="name">{p.full_name}</div>
                  <div className="email">{p.id === user.id ? '(You)' : ''}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className={`role-pill ${p.role}`}>{p.role}</span>
                  {p.id !== user.id && (
                    <button
                      onClick={() => setDeleteTarget(p.id)}
                      style={{
                        background: 'transparent', color: 'var(--red)', border: '1px solid var(--red)',
                        borderRadius: 4, padding: '4px 10px', fontSize: 11, fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Porter Account"
        message="This will remove the porter from the system. Their auth account will remain and must be deleted separately in Supabase dashboard."
        onConfirm={handleDeletePorter}
        onCancel={() => setDeleteTarget(null)}
        danger
      />
    </div>
  )
}
