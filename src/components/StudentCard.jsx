import * as store from '../store'

export default function StudentCard({ student, onClick }) {
  const isPerClass = student.type === 'per-class'

  let metricValue, metricLabel
  if (isPerClass) {
    const owed = store.getOwedBalance(student.id)
    metricValue = `$${owed}`
    metricLabel = 'Owed'
  } else {
    const pkg = store.getActivePackage(student.id)
    if (pkg) {
      metricValue = `${pkg.remainingClasses}/${pkg.totalClasses}`
      metricLabel = 'Classes left'
    } else {
      metricValue = '--'
      metricLabel = 'No package'
    }
  }

  return (
    <div className="student-card" onClick={() => onClick(student.id)}>
      <div className="student-card-left">
        <div className="student-name">{student.name}</div>
        <span className={`student-badge ${isPerClass ? '' : 'prepay'}`}>
          {isPerClass ? 'Per Class' : 'Pre-pay'}
        </span>
      </div>
      <div className="student-card-right" style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <div className="student-metric">{metricValue}</div>
          <div className="student-metric-label">{metricLabel}</div>
        </div>
        <span className="chevron">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </span>
      </div>
    </div>
  )
}
