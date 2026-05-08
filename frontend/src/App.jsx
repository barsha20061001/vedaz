import { Link, Navigate, Route, Routes } from 'react-router-dom'
import ExpertsListPage from './pages/ExpertsListPage'
import ExpertDetailPage from './pages/ExpertDetailPage'
import BookSessionPage from './pages/BookSessionPage'
import MyBookingsPage from './pages/MyBookingsPage'
import './App.css'

function App() {
  return (
    <div className="layout">
      <header className="header">
        <h1>Expert Session Booking</h1>
        <nav>
          <Link to="/">Experts</Link>
          <Link to="/my-bookings">My Bookings</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<ExpertsListPage />} />
          <Route path="/experts/:id" element={<ExpertDetailPage />} />
          <Route path="/experts/:id/book" element={<BookSessionPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
