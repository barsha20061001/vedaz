import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import { groupSlotsByDate, isValidEmail, isValidPhone } from '../utils'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  date: '',
  timeSlot: '',
  notes: '',
}

function BookSessionPage() {
  const { id } = useParams()
  const [expert, setExpert] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchExpert = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get(`/experts/${id}`)
        setExpert(data)
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load expert.')
      } finally {
        setLoading(false)
      }
    }
    fetchExpert()
  }, [id])

  const groupedSlots = useMemo(() => groupSlotsByDate(expert?.availableSlots), [expert?.availableSlots])
  const timesForDate = useMemo(
    () => groupedSlots.find((item) => item.date === form.date)?.times || [],
    [groupedSlots, form.date]
  )

  const validate = () => {
    if (!form.name.trim()) return 'Name is required.'
    if (!isValidEmail(form.email)) return 'Valid email is required.'
    if (!isValidPhone(form.phone)) return 'Valid phone number is required.'
    if (!form.date) return 'Please select a date.'
    if (!form.timeSlot) return 'Please select a time slot.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess('')
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await api.post('/bookings', {
        expertId: id,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        date: form.date,
        timeSlot: form.timeSlot,
        notes: form.notes.trim(),
      })
      setSuccess('Booking successful.')
      setForm(initialForm)
      const refreshed = await api.get(`/experts/${id}`)
      setExpert(refreshed.data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Booking failed.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p>Loading booking form...</p>
  if (!expert) return <p className="error">{error || 'Expert not found.'}</p>

  return (
    <section>
      <h2>Book Session with {expert.name}</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
        />
        <select
          value={form.date}
          onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value, timeSlot: '' }))}
        >
          <option value="">Select Date</option>
          {groupedSlots.map((slot) => (
            <option key={slot.date} value={slot.date}>
              {slot.date}
            </option>
          ))}
        </select>
        <select
          value={form.timeSlot}
          onChange={(e) => setForm((prev) => ({ ...prev, timeSlot: e.target.value }))}
          disabled={!form.date}
        >
          <option value="">Select Time Slot</option>
          {timesForDate.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
    </section>
  )
}

export default BookSessionPage
