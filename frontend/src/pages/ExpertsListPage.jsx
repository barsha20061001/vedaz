import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

const DEFAULT_LIMIT = 6

function ExpertsListPage() {
  const [experts, setExperts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  })

  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get('/experts', {
          params: {
            page: pagination.page,
            limit: DEFAULT_LIMIT,
            search,
            category,
          },
        })
        setExperts(data.data)
        setPagination((prev) => ({
          ...prev,
          totalPages: data.pagination.totalPages || 1,
        }))
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load experts.')
      } finally {
        setLoading(false)
      }
    }

    fetchExperts()
  }, [pagination.page, search, category])

  const categories = ['Fitness', 'Career', 'Mental Wellness']

  return (
    <section>
      <h2>Find Experts</h2>
      <div className="controls">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => {
            setPagination((prev) => ({ ...prev, page: 1 }))
            setSearch(e.target.value)
          }}
        />
        <select
          value={category}
          onChange={(e) => {
            setPagination((prev) => ({ ...prev, page: 1 }))
            setCategory(e.target.value)
          }}
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading experts...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="grid">
          {experts.map((expert) => (
            <article key={expert._id} className="card">
              <h3>{expert.name}</h3>
              <p>Category: {expert.category}</p>
              <p>Experience: {expert.experience} years</p>
              <p>Rating: {expert.rating} / 5</p>
              <Link to={`/experts/${expert._id}`}>View Details</Link>
            </article>
          ))}
          {!experts.length && <p>No experts found.</p>}
        </div>
      )}

      <div className="pagination">
        <button
          disabled={pagination.page <= 1}
          onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
        >
          Previous
        </button>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
        >
          Next
        </button>
      </div>
    </section>
  )
}

export default ExpertsListPage
