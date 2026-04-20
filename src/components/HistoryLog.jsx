import * as store from '../store'

function formatDate(ts) {
  const d = new Date(ts)
  const month = d.toLocaleString('en', { month: 'short' })
  const day = d.getDate()
  const time = d.toLocaleString('en', { hour: 'numeric', minute: '2-digit', hour12: true })
  return `${month} ${day}, ${time}`
}

const EVENT_CONFIG = {
  attendance: { icon: '\u2713', label: 'Class attended', className: 'attendance' },
  payment: { icon: '$', label: 'Payment received', className: 'payment' },
  offset: { icon: '\u21C4', label: 'Purchase offset', className: 'offset' },
  settlement: { icon: '\u2714', label: 'Balance settled', className: 'settlement' },
  'package-purchase': { icon: '\u25A0', label: 'Package purchased', className: 'package-purchase' },
}

export default function HistoryLog({ studentId }) {
  const history = store.getHistory(studentId)

  if (history.length === 0) {
    return (
      <div className="history-section">
        <div className="history-title">History</div>
        <div className="history-list">
          <div className="history-empty">No records yet</div>
        </div>
      </div>
    )
  }

  return (
    <div className="history-section">
      <div className="history-title">History</div>
      <div className="history-list">
        {history.map(item => {
          const config = EVENT_CONFIG[item.eventType] || EVENT_CONFIG.attendance
          const showAmount = item.eventType !== 'attendance' && item.amount != null

          return (
            <div key={item.id} className="history-item">
              <div className={`history-icon ${config.className}`}>
                {config.icon}
              </div>
              <div className="history-info">
                <div className="history-label">{config.label}</div>
                {item.note && <div className="history-note">{item.note}</div>}
              </div>
              <div className="history-meta">
                {showAmount && (
                  <div className="history-amount">${item.amount}</div>
                )}
                <div className="history-date">{formatDate(item.date)}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
