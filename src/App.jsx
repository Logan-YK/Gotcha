import { useState, useEffect, useCallback } from 'react'
import * as store from './store'
import Header from './components/Header'
import StudentList from './components/StudentList'
import StudentDetail from './components/StudentDetail'
import AddEditStudent from './components/AddEditStudent'

export default function App() {
  const [students, setStudents] = useState([])
  const [view, setView] = useState('list')
  const [selectedStudentId, setSelectedStudentId] = useState(null)
  const [editingStudent, setEditingStudent] = useState(null)

  const refresh = useCallback(() => {
    setStudents(store.getStudents())
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleSelectStudent = (id) => {
    setSelectedStudentId(id)
    setView('detail')
  }

  const handleAddNew = () => {
    setEditingStudent(null)
    setView('add')
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    setView('add')
  }

  const handleBack = () => {
    setView('list')
    setSelectedStudentId(null)
    setEditingStudent(null)
    refresh()
  }

  const handleBackToDetail = () => {
    setView('detail')
    setEditingStudent(null)
    refresh()
  }

  const handleSaveStudent = (data) => {
    if (editingStudent) {
      store.updateStudent(editingStudent.id, data)
    } else {
      store.addStudent(data)
    }
    if (editingStudent && selectedStudentId) {
      handleBackToDetail()
    } else {
      handleBack()
    }
  }

  const handleDeleteStudent = (id) => {
    store.deleteStudent(id)
    handleBack()
  }

  return (
    <div className="app">
      {view === 'list' && (
        <>
          <Header />
          <StudentList
            students={students}
            onSelect={handleSelectStudent}
            onAdd={handleAddNew}
          />
        </>
      )}
      {view === 'detail' && selectedStudentId && (
        <StudentDetail
          studentId={selectedStudentId}
          onBack={handleBack}
          onEdit={handleEdit}
          onDelete={handleDeleteStudent}
          onRefresh={refresh}
        />
      )}
      {view === 'add' && (
        <AddEditStudent
          student={editingStudent}
          onSave={handleSaveStudent}
          onBack={editingStudent && selectedStudentId ? handleBackToDetail : handleBack}
        />
      )}
    </div>
  )
}
