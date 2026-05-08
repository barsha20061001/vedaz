import { useState } from 'react'
import api from '../api'

function MyBookingsPage() {
  const [email, setEmail] = useState('')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchBookings = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.get('/bookings', {
        params: { email: email.trim() },
      })
      setBookings(data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch bookings.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2>My Bookings</h2>
      <form onSubmit={fetchBookings} className="inline-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Get Bookings'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      <div className="grid">
        {bookings.map((booking) => (
          <article key={booking._id} className="card">
            <h3>{booking.expertName}</h3>
            <p>Name: {booking.name}</p>
            <p>Date: {booking.date}</p>
            <p>Time: {booking.timeSlot}</p>
            <p>Status: {booking.status}</p>
          </article>
        ))}
      </div>
      {!loading && !bookings.length && <p>No bookings found.</p>}
    </section>
  )
}

export default MyBookingsPage
