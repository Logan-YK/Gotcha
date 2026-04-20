import { useState } from 'react'
import BackButton from './BackButton'

export default function AddEditStudent({ student, onSave, onBack }) {
  const [name, setName] = useState(student?.name || '')
  const [type, setType] = useState(student?.type || 'per-class')
  const [perClassRate, setPerClassRate] = useState(
    student?.perClassRate != null ? String(student.perClassRate) : ''
  )

  const isEditing = !!student

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    if (type === 'per-class' && (!perClassRate || Number(perClassRate) <= 0)) return

    onSave({
      name: name.trim(),
      type,
      perClassRate: type === 'per-class' ? Number(perClassRate) : null,
    })
  }

  const canSubmit = name.trim() &&
    (type === 'pre-pay' || (perClassRate && Number(perClassRate) > 0))

  return (
    <>
      <div className="nav-header">
        <BackButton onClick={onBack} label="Cancel" />
        <div className="nav-title">{isEditing ? 'Edit Student' : 'New Student'}</div>
        <div style={{ width: 60 }} />
      </div>

      <div className="form-page">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="Student name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment type</label>
            <div className="type-selector">
              <button
                type="button"
                className={`type-option ${type === 'per-class' ? 'selected' : ''}`}
                onClick={() => setType('per-class')}
              >
                Per Class
              </button>
              <button
                type="button"
                className={`type-option ${type === 'pre-pay' ? 'selected' : ''}`}
                onClick={() => setType('pre-pay')}
              >
                Pre-pay
              </button>
            </div>
          </div>

          {type === 'per-class' && (
            <div className="form-group">
              <label className="form-label">Rate per class</label>
              <input
                className="form-input"
                type="number"
                inputMode="decimal"
                step="any"
                min="0"
                placeholder="0.00"
                value={perClassRate}
                onChange={e => setPerClassRate(e.target.value)}
              />
            </div>
          )}

          <button className="submit-btn" type="submit" disabled={!canSubmit}>
            {isEditing ? 'Save Changes' : 'Add Student'}
          </button>
        </form>
      </div>
    </>
  )
}
