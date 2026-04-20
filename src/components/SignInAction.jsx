import { useState } from 'react'
import BottomSheet from './BottomSheet'
import * as store from '../store'

function todayStr() {
  const d = new Date()
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0')
}

export default function SignInAction({ student, onDone, onClose }) {
  const [date, setDate] = useState(todayStr())
  const [price, setPrice] = useState(
    student.perClassRate != null ? String(student.perClassRate) : ''
  )

  const isPrePay = student.type === 'pre-pay'
  const pkg = isPrePay ? store.getActivePackage(student.id) : null

  const handleSubmit = (e) => {
    e.preventDefault()
    const ts = new Date(date + 'T12:00:00').getTime()
    const classPrice = isPrePay ? null : (price ? Number(price) : 0)
    store.signIn(student.id, ts, classPrice)
    onDone()
  }

  const canSubmit = date &&
    (isPrePay ? (pkg && pkg.remainingClasses > 0) : (price && Number(price) > 0))

  return (
    <BottomSheet title="Sign In" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Class date</label>
          <input
            className="form-input"
            type="date"
            value={date}
            max={todayStr()}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        {!isPrePay && (
          <div className="form-group">
            <label className="form-label">Price for this class</label>
            <input
              className="form-input"
              type="number"
              inputMode="decimal"
              step="any"
              min="0"
              placeholder="0.00"
              value={price}
              onChange={e => setPrice(e.target.value)}
              autoFocus
            />
            {student.perClassRate != null && (
              <div style={{ fontSize: 12, color: '#8e8e93', marginTop: 4 }}>
                Default rate: ${student.perClassRate}
              </div>
            )}
          </div>
        )}

        {isPrePay && pkg && (
          <div className="confirm-text">
            Remaining after this: {pkg.remainingClasses - 1}/{pkg.totalClasses}
          </div>
        )}
        {isPrePay && pkg && pkg.remainingClasses <= 0 && (
          <div className="confirm-text" style={{ color: '#ff3b30' }}>
            No classes remaining in current package!
          </div>
        )}
        {isPrePay && !pkg && (
          <div className="confirm-text" style={{ color: '#ff3b30' }}>
            No active package. Create one first.
          </div>
        )}

        <button className="submit-btn" type="submit" disabled={!canSubmit}>
          Confirm Sign In
        </button>
        <button className="cancel-btn" type="button" onClick={onClose}>Cancel</button>
      </form>
    </BottomSheet>
  )
}
