import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import api from '../api'
import { groupSlotsByDate } from '../utils'

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
  autoConnect: true,
})

function ExpertDetailPage() {
  const { id } = useParams()
  const [expert, setExpert] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchExpert = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get(`/experts/${id}`)
        setExpert(data)
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch expert details.')
      } finally {
        setLoading(false)
      }
    }

    fetchExpert()
  }, [id])

  useEffect(() => {
    if (!id) return undefined
    socket.emit('watch-expert', id)
    const onSlotBooked = (payload) => {
      if (payload.expertId !== id) return
      setExpert((prev) => {
        if (!prev) return prev
        const updatedSlots = prev.availableSlots
          .map((slot) =>
            slot.date === payload.date
              ? { ...slot, times: slot.times.filter((time) => time !== payload.timeSlot) }
              : slot
          )
          .filter((slot) => slot.times.length > 0)
        return { ...prev, availableSlots: updatedSlots }
      })
    }

    socket.on('slot-booked', onSlotBooked)
    return () => socket.off('slot-booked', onSlotBooked)
  }, [id])

  const groupedSlots = useMemo(
    () => groupSlotsByDate(expert?.availableSlots || []),
    [expert?.availableSlots]
  )

  if (loading) return <p>Loading expert details...</p>
  if (error) return <p className="error">{error}</p>
  if (!expert) return <p>Expert not found.</p>

  return (
    <section>
      <h2>{expert.name}</h2>
      <p>Category: {expert.category}</p>
      <p>Experience: {expert.experience} years</p>
      <p>Rating: {expert.rating} / 5</p>
      <p>{expert.bio}</p>

      <h3>Available Slots</h3>
      {!groupedSlots.length && <p>All slots are booked.</p>}
      <div className="slots-list">
        {groupedSlots.map((slotGroup) => (
          <div key={slotGroup.date} className="slot-date-group">
            <strong>{slotGroup.date}</strong>
            <div className="chips">
              {slotGroup.times.map((time) => (
                <span key={`${slotGroup.date}-${time}`} className="chip">
                  {time}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Link to={`/experts/${expert._id}/book`} className="button-link">
        Book Session
      </Link>
    </section>
  )
}

export default ExpertDetailPage
