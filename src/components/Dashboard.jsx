import * as store from '../store'

export default function Dashboard() {
  const stats = store.getDashboardStats()

  return (
    <div className="dashboard-card">
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-value">${stats.totalOwed}</div>
          <div className="stat-label">Total Owed</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{stats.totalPrePayRemaining}</div>
          <div className="stat-label">Pre-pay Left</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{stats.classesThisWeek}</div>
          <div className="stat-label">This Week</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{stats.classesThisMonth}</div>
          <div className="stat-label">This Month</div>
        </div>
      </div>
    </div>
  )
}
