import { useData } from '../context/DataContext'

export default function StatsRow() {
  const { stats } = useData()

  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-num">{stats.students}</div>
        <div className="stat-label">Total Students</div>
      </div>
      <div className="stat-card">
        <div className="stat-num">{stats.records}</div>
        <div className="stat-label">Default Records</div>
      </div>
      <div className="stat-card">
        <div className="stat-num">{stats.recent}</div>
        <div className="stat-label">This Month</div>
      </div>
    </div>
  )
}
