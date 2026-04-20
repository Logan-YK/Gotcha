import { useState } from 'react'
import BottomSheet from './BottomSheet'
import * as store from '../store'

function tsToDateStr(ts) {
  const d = new Date(ts)
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0')
}

const TYPE_LABELS = {
  attendance: 'Class Attended',
  payment: 'Payment Received',
  offset: 'Purchase Offset',
  settlement: 'Balance Settled',
  'package-purchase': 'Package Purchased',
}

export default function EditRecordSheet({ record, student, onDone, onClose }) {
  const type = record.eventType
  const isSettlement = type === 'settlement'
  const isAttendance = type === 'attendance'
  const isPerClass = student.type === 'per-class'

  const [date, setDate] = useState(tsToDateStr(record.date))
  const [amount, setAmount] = useState(
    record.amount != null ? String(record.amount) : ''
  )
  const [price, setPrice] = useState(
    record.price != null ? String(record.price) : ''
  )
  const [note, setNote] = useState(record.note || '')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    const ts = new Date(date + 'T12:00:00').getTime()

    if (isAttendance) {
      store.updateAttendance(record.id, {
        date: ts,
        price: isPerClass && price ? Number(price) : record.price,
      })
    } else {
      store.updatePaymentRecord(record.id, {
        date: ts,
        amount: amount ? Number(amount) : record.amount,
        note,
      })
    }
    onDone()
  }

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    if (isAttendance) {
      store.deleteAttendance(record.id)
    } else {
      store.deletePaymentRecord(record.id)
    }
    onDone()
  }

  return (
    <BottomSheet title={`Edit ${TYPE_LABELS[type] || 'Record'}`} onClose={onClose}>
      {isSettlement && (
        <div className="warning-banner">
          Editing settlements may affect balance calculations. Be careful.
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            className="form-input"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        {isAttendance && isPerClass && (
          <div className="form-group">
            <label className="form-label">Class price</label>
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
        )}

        {!isAttendance && (
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
            />
          </div>
        )}

        {(type === 'offset' || type === 'package-purchase') && (
          <div className="form-group">
            <label className="form-label">Note</label>
            <input
              className="form-input"
              type="text"
              placeholder="Description"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>
        )}

        <button className="submit-btn" type="submit">Save Changes</button>
      </form>

      <div className="delete-zone" style={{ marginTop: 16 }}>
        {confirmDelete && isSettlement && (
          <div className="warning-banner" style={{ marginBottom: 8 }}>
            Deleting this settlement will change the owed balance. Tap again to confirm.
          </div>
        )}
        {confirmDelete && !isSettlement && (
          <div style={{ fontSize: 13, color: '#ff3b30', textAlign: 'center', marginBottom: 8 }}>
            Tap again to confirm deletion
          </div>
        )}
        <button
          className="delete-btn"
          onClick={handleDelete}
          style={{ width: '100%' }}
        >
          {confirmDelete ? 'Confirm Delete' : 'Delete Record'}
        </button>
      </div>
    </BottomSheet>
  )
}
