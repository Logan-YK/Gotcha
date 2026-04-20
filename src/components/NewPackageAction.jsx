import { useState } from 'react'
import BottomSheet from './BottomSheet'
import * as store from '../store'

export default function NewPackageAction({ student, onDone, onClose }) {
  const [totalClasses, setTotalClasses] = useState('10')
  const [price, setPrice] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!totalClasses || !price || Number(totalClasses) <= 0 || Number(price) <= 0) return
    store.createPackage(student.id, totalClasses, price)
    onDone()
  }

  const existing = store.getActivePackage(student.id)

  return (
    <BottomSheet title="New Package" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {existing && (
          <div className="confirm-text" style={{ color: '#ff9500' }}>
            Current package ({existing.remainingClasses}/{existing.totalClasses} left) will be replaced.
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Number of classes</label>
          <input
            className="form-input"
            type="number"
            inputMode="numeric"
            min="1"
            placeholder="10"
            value={totalClasses}
            onChange={e => setTotalClasses(e.target.value)}
            autoFocus
          />
        </div>
        <div className="form-group">
          <label className="form-label">Total price</label>
          <input
            className="form-input"
            type="number"
            inputMode="decimal"
            step="any"
            min="0"
            placeholder="0.00"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
        </div>
        <button
          className="submit-btn"
          type="submit"
          disabled={!totalClasses || !price || Number(totalClasses) <= 0 || Number(price) <= 0}
        >
          Create Package
        </button>
        <button className="cancel-btn" type="button" onClick={onClose}>Cancel</button>
      </form>
    </BottomSheet>
  )
}
