import { useEffect, useState } from 'react'
import { getApiEndpoint, normalizeListResponse } from '../api.js'

function formatDate(dateString) {
  return dateString ? new Date(dateString).toLocaleDateString() : 'N/A'
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchUsers() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(getApiEndpoint('users'), { signal: controller.signal })
        const payload = await response.json()
        if (!response.ok) {
          throw new Error(payload?.message || 'Unable to load users')
        }
        setUsers(normalizeListResponse(payload))
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError(error.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
    return () => controller.abort()
  }, [])

  return (
    <div>
      <h1 className="mb-4">Users</h1>
      <p className="text-muted">Fetches data from <code>{getApiEndpoint('users')}</code></p>

      {loading && <div className="alert alert-secondary">Loading users...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && users.length === 0 && (
        <div className="alert alert-warning">No users were found.</div>
      )}

      {users.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Fitness level</th>
                <th>Total points</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id ?? index}>
                  <td>{user.name ?? 'Unknown'}</td>
                  <td>{user.fitnessLevel ?? '—'}</td>
                  <td>{user.totalPoints ?? '—'}</td>
                  <td>{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
