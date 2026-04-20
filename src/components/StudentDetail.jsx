import { useState, useCallback } from 'react'
import * as store from '../store'
import BackButton from './BackButton'
import HistoryLog from './HistoryLog'
import SignInAction from './SignInAction'
import PaymentAction from './PaymentAction'
import OffsetAction from './OffsetAction'
import SettleAction from './SettleAction'
import NewPackageAction from './NewPackageAction'

export default function StudentDetail({ studentId, onBack, onEdit, onDelete, onRefresh }) {
  const [sheet, setSheet] = useState(null)
  const [, setTick] = useState(0)
  const refresh = useCallback(() => {
    setTick(t => t + 1)
    onRefresh()
  }, [onRefresh])

  const student = store.getStudent(studentId)
  if (!student) return null

  const isPerClass = student.type === 'per-class'

  const handleDone = () => {
    setSheet(null)
    refresh()
  }

  const renderStats = () => {
    if (isPerClass) {
      const classCount = store.getUnsettledAttendanceCount(studentId)
      const owed = store.getOwedBalance(studentId)
      const paid = store.getTotalPaidSinceSettlement(studentId)

      return (
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-value">{classCount}</div>
            <div className="stat-label">Classes</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">${student.perClassRate}</div>
            <div className="stat-label">Per Class</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">${owed}</div>
            <div className="stat-label">Owed</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">${paid}</div>
            <div className="stat-label">Paid / Offset</div>
          </div>
        </div>
      )
    } else {
      const pkg = store.getActivePackage(studentId)
      if (!pkg) {
        return (
          <div className="stats-grid">
            <div className="stat-box full-width">
              <div className="stat-value">--</div>
              <div className="stat-label">No active package</div>
            </div>
          </div>
        )
      }
      return (
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-value">{pkg.remainingClasses}</div>
            <div className="stat-label">Remaining</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{pkg.totalClasses}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-box full-width">
            <div className="stat-value">${pkg.price}</div>
            <div className="stat-label">Package Price</div>
          </div>
        </div>
      )
    }
  }

  return (
    <>
      <div className="nav-header">
        <BackButton onClick={onBack} />
        <div className="nav-title">{student.name}</div>
        <button className="nav-action-btn" onClick={() => onEdit(student)}>Edit</button>
      </div>

      <div className="detail-content">
        <div className="detail-summary">
          <div className="detail-name">{student.name}</div>
          <div className="detail-type-row">
            <span className={`student-badge ${isPerClass ? '' : 'prepay'}`}>
              {isPerClass ? 'Per Class' : 'Pre-pay'}
            </span>
            {isPerClass && (
              <span className="detail-rate">${student.perClassRate}/class</span>
            )}
          </div>
          {renderStats()}
        </div>

        <div className="action-buttons">
          <button className="action-btn primary" onClick={() => setSheet('signin')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Sign In
          </button>

          {isPerClass && (
            <>
              <button className="action-btn" onClick={() => setSheet('payment')}>
                $ Payment
              </button>
              <button className="action-btn" onClick={() => setSheet('offset')}>
                Offset
              </button>
              <button className="action-btn" onClick={() => setSheet('settle')}>
                Settle
              </button>
            </>
          )}

          {!isPerClass && (
            <button className="action-btn" onClick={() => setSheet('package')}>
              New Package
            </button>
          )}
        </div>

        <HistoryLog studentId={studentId} />

        <div className="delete-zone">
          <button className="delete-btn" onClick={() => {
            if (confirm(`Delete ${student.name}? This cannot be undone.`)) {
              onDelete(student.id)
            }
          }}>
            Delete Student
          </button>
        </div>
      </div>

      {sheet === 'signin' && (
        <SignInAction student={student} onDone={handleDone} onClose={() => setSheet(null)} />
      )}
      {sheet === 'payment' && (
        <PaymentAction student={student} onDone={handleDone} onClose={() => setSheet(null)} />
      )}
      {sheet === 'offset' && (
        <OffsetAction student={student} onDone={handleDone} onClose={() => setSheet(null)} />
      )}
      {sheet === 'settle' && (
        <SettleAction student={student} onDone={handleDone} onClose={() => setSheet(null)} />
      )}
      {sheet === 'package' && (
        <NewPackageAction student={student} onDone={handleDone} onClose={() => setSheet(null)} />
      )}
    </>
  )
}
