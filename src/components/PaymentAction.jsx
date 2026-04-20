import { useState } from 'react'
import BottomSheet from './BottomSheet'
import * as store from '../store'

export default function PaymentAction({ student, onDone, onClose }) {
  const [amount, setAmount] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) return
    store.recordPayment(student.id, amount, '')
    onDone()
  }

  const owed = store.getOwedBalance(student.id)

  return (
    <BottomSheet title="Record Payment" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="confirm-text">
          Currently owed: <strong>${owed}</strong>
        </div>
        <div className="form-group">
          <label className="form-label">Amount received</label>
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
        <button className="submit-btn" type="submit" disabled={!amount || Number(amount) <= 0}>
          Record Payment
        </button>
        <button className="cancel-btn" type="button" onClick={onClose}>Cancel</button>
      </form>
    </BottomSheet>
  )
}
