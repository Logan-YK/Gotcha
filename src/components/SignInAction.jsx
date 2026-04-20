import BottomSheet from './BottomSheet'
import * as store from '../store'

export default function SignInAction({ student, onDone, onClose }) {
  const handleConfirm = () => {
    store.signIn(student.id)
    onDone()
  }

  const isPrePay = student.type === 'pre-pay'
  const pkg = isPrePay ? store.getActivePackage(student.id) : null

  return (
    <BottomSheet title="Sign In" onClose={onClose}>
      <div className="confirm-text">
        Record a class for <strong>{student.name}</strong>?
      </div>
      {isPrePay && pkg && (
        <div className="confirm-text" style={{ marginTop: -8 }}>
          Remaining after this: {pkg.remainingClasses - 1}/{pkg.totalClasses}
        </div>
      )}
      {isPrePay && pkg && pkg.remainingClasses <= 0 && (
        <div className="confirm-text" style={{ color: '#ff3b30', marginTop: -8 }}>
          No classes remaining in current package!
        </div>
      )}
      {isPrePay && !pkg && (
        <div className="confirm-text" style={{ color: '#ff3b30', marginTop: -8 }}>
          No active package. Create one first.
        </div>
      )}
      <button
        className="submit-btn"
        onClick={handleConfirm}
        disabled={isPrePay && (!pkg || pkg.remainingClasses <= 0)}
      >
        Confirm Sign In
      </button>
      <button className="cancel-btn" onClick={onClose}>Cancel</button>
    </BottomSheet>
  )
}
