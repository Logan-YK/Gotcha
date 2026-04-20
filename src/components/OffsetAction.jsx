import { useState } from 'react'
import BottomSheet from './BottomSheet'
import * as store from '../store'

export default function OffsetAction({ student, onDone, onClose }) {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) return
    store.recordOffset(student.id, amount, note)
    onDone()
  }

  return (
    <BottomSheet title="Purchase Offset" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="confirm-text">
          Enter the amount <strong>{student.name}</strong> spent on a purchase for you.
        </div>
        <div className="form-group">
          <label className="form-label">Amount</label>
          <input
            className="form-input"
            type="number"
            inputMode="decimal"
            step="any"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            autoFocus
          />
        </div>
        <div className="form-group">
          <label className="form-label">What did they buy?</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. Protein powder"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>
        <button className="submit-btn" type="submit" disabled={!amount || Number(amount) <= 0}>
          Record Offset
        </button>
        <button className="cancel-btn" type="button" onClick={onClose}>Cancel</button>
      </form>
    </BottomSheet>
  )
}
