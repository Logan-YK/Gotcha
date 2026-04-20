import BottomSheet from './BottomSheet'
import * as store from '../store'

export default function SettleAction({ student, onDone, onClose }) {
  const owed = store.getOwedBalance(student.id)

  const handleConfirm = () => {
    store.settleBalance(student.id)
    onDone()
  }

  return (
    <BottomSheet title="Settle Balance" onClose={onClose}>
      <div className="confirm-text">
        Mark <strong>{student.name}</strong>&apos;s balance as fully paid?
      </div>
      <div className="confirm-highlight">${owed}</div>
      <div className="confirm-text" style={{ marginTop: -8 }}>
        This will clear the running balance. History is preserved.
      </div>
      <button className="submit-btn" onClick={handleConfirm} disabled={owed <= 0}>
        Settle ${owed}
      </button>
      <button className="cancel-btn" onClick={onClose}>Cancel</button>
    </BottomSheet>
  )
}
