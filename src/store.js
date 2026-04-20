const KEYS = {
  students: 'gotcha_students',
  attendance: 'gotcha_attendance',
  payments: 'gotcha_payments',
  packages: 'gotcha_packages',
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || []
  } catch {
    return []
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

// ── Students ──────────────────────────────────────────────

export function getStudents() {
  return load(KEYS.students).sort((a, b) => a.name.localeCompare(b.name))
}

export function getStudent(id) {
  return load(KEYS.students).find(s => s.id === id) || null
}

export function addStudent({ name, type, perClassRate }) {
  const students = load(KEYS.students)
  const student = {
    id: uid(),
    name: name.trim(),
    type,
    perClassRate: type === 'per-class' ? Number(perClassRate) : null,
    createdAt: Date.now(),
  }
  students.push(student)
  save(KEYS.students, students)
  return student
}

export function updateStudent(id, updates) {
  const students = load(KEYS.students)
  const idx = students.findIndex(s => s.id === id)
  if (idx === -1) return null
  students[idx] = { ...students[idx], ...updates, id }
  save(KEYS.students, students)
  return students[idx]
}

export function deleteStudent(id) {
  save(KEYS.students, load(KEYS.students).filter(s => s.id !== id))
  save(KEYS.attendance, load(KEYS.attendance).filter(r => r.studentId !== id))
  save(KEYS.payments, load(KEYS.payments).filter(r => r.studentId !== id))
  save(KEYS.packages, load(KEYS.packages).filter(p => p.studentId !== id))
}

// ── Attendance ────────────────────────────────────────────

export function getAttendance(studentId) {
  return load(KEYS.attendance)
    .filter(r => r.studentId === studentId)
    .sort((a, b) => b.date - a.date)
}

export function getAllAttendance() {
  return load(KEYS.attendance)
}

export function signIn(studentId, date, price) {
  const records = load(KEYS.attendance)
  const record = {
    id: uid(),
    studentId,
    date: date || Date.now(),
    price: price != null ? Number(price) : null,
  }
  records.push(record)
  save(KEYS.attendance, records)

  const student = getStudent(studentId)
  if (student?.type === 'pre-pay') {
    const pkg = getActivePackage(studentId)
    if (pkg && pkg.remainingClasses > 0) {
      _updatePackage(pkg.id, { remainingClasses: pkg.remainingClasses - 1 })
    }
  }

  return record
}

export function updateAttendance(id, updates) {
  const records = load(KEYS.attendance)
  const idx = records.findIndex(r => r.id === id)
  if (idx === -1) return null
  if (updates.date !== undefined) records[idx].date = updates.date
  if (updates.price !== undefined) records[idx].price = updates.price
  save(KEYS.attendance, records)
  return records[idx]
}

export function deleteAttendance(id) {
  const records = load(KEYS.attendance)
  const record = records.find(r => r.id === id)
  if (!record) return

  save(KEYS.attendance, records.filter(r => r.id !== id))

  // If pre-pay student, give back the class to active package
  const student = getStudent(record.studentId)
  if (student?.type === 'pre-pay') {
    const pkg = getActivePackage(record.studentId)
    if (pkg) {
      _updatePackage(pkg.id, { remainingClasses: pkg.remainingClasses + 1 })
    }
  }
}

// ── Payments ──────────────────────────────────────────────

export function getPayments(studentId) {
  return load(KEYS.payments)
    .filter(r => r.studentId === studentId)
    .sort((a, b) => b.date - a.date)
}

export function recordPayment(studentId, amount, note) {
  const records = load(KEYS.payments)
  const record = {
    id: uid(),
    studentId,
    amount: Number(amount),
    date: Date.now(),
    type: 'payment',
    note: note || '',
  }
  records.push(record)
  save(KEYS.payments, records)
  return record
}

export function recordOffset(studentId, amount, note) {
  const records = load(KEYS.payments)
  const record = {
    id: uid(),
    studentId,
    amount: Number(amount),
    date: Date.now(),
    type: 'offset',
    note: note || '',
  }
  records.push(record)
  save(KEYS.payments, records)
  return record
}

export function settleBalance(studentId) {
  const balance = getOwedBalance(studentId)
  if (balance <= 0) return null
  const records = load(KEYS.payments)
  const record = {
    id: uid(),
    studentId,
    amount: balance,
    date: Date.now(),
    type: 'settlement',
    note: '',
  }
  records.push(record)
  save(KEYS.payments, records)
  return record
}

export function updatePaymentRecord(id, updates) {
  const records = load(KEYS.payments)
  const idx = records.findIndex(r => r.id === id)
  if (idx === -1) return null
  if (updates.amount !== undefined) records[idx].amount = Number(updates.amount)
  if (updates.date !== undefined) records[idx].date = updates.date
  if (updates.note !== undefined) records[idx].note = updates.note
  save(KEYS.payments, records)
  return records[idx]
}

export function deletePaymentRecord(id) {
  save(KEYS.payments, load(KEYS.payments).filter(r => r.id !== id))
}

// ── Packages ──────────────────────────────────────────────

export function getPackages(studentId) {
  return load(KEYS.packages)
    .filter(p => p.studentId === studentId)
    .sort((a, b) => b.createdAt - a.createdAt)
}

export function getActivePackage(studentId) {
  return load(KEYS.packages).find(p => p.studentId === studentId && p.active) || null
}

export function createPackage(studentId, totalClasses, price) {
  const packages = load(KEYS.packages)
  packages.forEach(p => {
    if (p.studentId === studentId) p.active = false
  })
  const pkg = {
    id: uid(),
    studentId,
    totalClasses: Number(totalClasses),
    remainingClasses: Number(totalClasses),
    price: Number(price),
    createdAt: Date.now(),
    active: true,
  }
  packages.push(pkg)
  save(KEYS.packages, packages)

  const payments = load(KEYS.payments)
  payments.push({
    id: uid(),
    studentId,
    amount: Number(price),
    date: Date.now(),
    type: 'package-purchase',
    note: `${totalClasses} classes`,
  })
  save(KEYS.payments, payments)

  return pkg
}

function _updatePackage(id, updates) {
  const packages = load(KEYS.packages)
  const idx = packages.findIndex(p => p.id === id)
  if (idx === -1) return
  packages[idx] = { ...packages[idx], ...updates }
  save(KEYS.packages, packages)
}

export function updatePackageRecord(id, updates) {
  const packages = load(KEYS.packages)
  const idx = packages.findIndex(p => p.id === id)
  if (idx === -1) return null
  const old = packages[idx]
  if (updates.totalClasses !== undefined) {
    const newTotal = Number(updates.totalClasses)
    const diff = newTotal - old.totalClasses
    packages[idx].totalClasses = newTotal
    packages[idx].remainingClasses = Math.max(0, old.remainingClasses + diff)
  }
  if (updates.price !== undefined) packages[idx].price = Number(updates.price)
  save(KEYS.packages, packages)
  return packages[idx]
}

export function deletePackageRecord(id) {
  save(KEYS.packages, load(KEYS.packages).filter(p => p.id !== id))
}

// ── Computed balances ─────────────────────────────────────

export function getUnsettledAttendanceCount(studentId) {
  const payments = getPayments(studentId)
  const lastSettlement = payments.find(p => p.type === 'settlement')
  const since = lastSettlement ? lastSettlement.date : 0

  return getAttendance(studentId).filter(r => r.date > since).length
}

export function getOwedBalance(studentId) {
  const student = getStudent(studentId)
  if (!student || student.type !== 'per-class') return 0

  const payments = getPayments(studentId)
  const lastSettlement = payments.find(p => p.type === 'settlement')
  const since = lastSettlement ? lastSettlement.date : 0

  const totalClassCost = getAttendance(studentId)
    .filter(r => r.date > since)
    .reduce((sum, r) => sum + (r.price || 0), 0)

  const totalPaid = payments
    .filter(p => p.date > since && (p.type === 'payment' || p.type === 'offset'))
    .reduce((sum, p) => sum + p.amount, 0)

  return Math.max(0, totalClassCost - totalPaid)
}

export function getTotalPaidSinceSettlement(studentId) {
  const payments = getPayments(studentId)
  const lastSettlement = payments.find(p => p.type === 'settlement')
  const since = lastSettlement ? lastSettlement.date : 0

  return payments
    .filter(p => p.date > since && (p.type === 'payment' || p.type === 'offset'))
    .reduce((sum, p) => sum + p.amount, 0)
}

// ── Dashboard stats ───────────────────────────────────────

export function getDashboardStats() {
  const students = getStudents()
  const allAttendance = getAllAttendance()

  let totalOwed = 0
  let totalPrePayRemaining = 0

  students.forEach(s => {
    if (s.type === 'per-class') {
      totalOwed += getOwedBalance(s.id)
    } else {
      const pkg = getActivePackage(s.id)
      if (pkg) totalPrePayRemaining += pkg.remainingClasses
    }
  })

  const now = new Date()
  const dayOfWeek = now.getDay()
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - mondayOffset)
  weekStart.setHours(0, 0, 0, 0)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  monthStart.setHours(0, 0, 0, 0)

  const classesThisWeek = allAttendance.filter(r => r.date >= weekStart.getTime()).length
  const classesThisMonth = allAttendance.filter(r => r.date >= monthStart.getTime()).length

  return { totalOwed, totalPrePayRemaining, classesThisWeek, classesThisMonth }
}

// ── History (unified timeline) ────────────────────────────

export function getHistory(studentId) {
  const attendance = getAttendance(studentId).map(r => ({
    ...r,
    eventType: 'attendance',
  }))
  const payments = getPayments(studentId).map(r => ({
    ...r,
    eventType: r.type,
  }))
  return [...attendance, ...payments].sort((a, b) => b.date - a.date)
}
