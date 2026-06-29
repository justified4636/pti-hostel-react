import { useState } from 'react'
import { sb } from '../lib/supabase'
import { useData } from '../context/DataContext'

export default function SearchPanel({ onSelectStudent }) {
  const { students, loadStudents, refreshAll } = useData()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchDate, setSearchDate] = useState('')

  function performSearch(q) {
    if (!q.trim()) {
      setResults([])
      setSearched(false)
      return
    }

    let base = sb.from('students').select('*')
      .or(`matric_number.ilike.%${q.trim()}%,full_name.ilike.%${q.trim()}%`)

    if (searchDate) {
      base = base.eq('created_at::date', searchDate)
    }

    base.then(({ data }) => {
      setResults(data || [])
      setSearched(true)
      setLoading(false)
    })
  }

  function handleSearch() {
    setLoading(true)
    performSearch(query)
  }

  function handleInputChange(e) {
    const val = e.target.value
    setQuery(val)
    if (val.trim().length >= 2) {
      setLoading(true)
      clearTimeout(window._searchTimeout)
      window._searchTimeout = setTimeout(() => performSearch(val), 400)
    } else if (!val.trim()) {
      setResults([])
      setSearched(false)
    }
  }

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search by name or matric number..."
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <input
          type="date"
          value={searchDate}
          onChange={e => { setSearchDate(e.target.value); if (query.trim()) { setLoading(true); performSearch(query); } }}
          style={{ width: 160, flexShrink: 0 }}
        />
        <button className="btn-search" onClick={handleSearch}>Search</button>
      </div>

      <div>
        {!searched ? (
          <div className="card">
            <div className="card-body">
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <p>Search for a student by name or matric number</p>
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="card"><div className="card-body"><p style={{ textAlign: 'center', color: 'var(--gray-400)' }}>Searching...</p></div></div>
        ) : results.length === 0 ? (
          <div className="card">
            <div className="card-body">
              <div className="empty-state"><p>No students found. Try a different search.</p></div>
            </div>
          </div>
        ) : (
          <div className="card">
            <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--gray-200)', fontSize: 13, color: 'var(--gray-400)' }}>
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Matric No.</th><th>Full Name</th><th>Programme</th>
                    <th>Block/Room</th><th>Level</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(s => (
                    <tr key={s.id}>
                      <td><strong>{s.matric_number}</strong></td>
                      <td>{s.full_name}</td>
                      <td>{s.programme}</td>
                      <td>{s.hostel_block} / {s.room_number}</td>
                      <td>{s.year_of_study}</td>
                      <td>
                        <button className="btn-view" onClick={() => onSelectStudent(s.id)}>
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
