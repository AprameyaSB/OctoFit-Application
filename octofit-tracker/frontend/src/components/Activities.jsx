import { useEffect, useState } from 'react'
import { getApiEndpoint, normalizeListResponse } from '../api.js'

// Codespaces preview API path example:
// https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/activities

function formatDate(dateString) {
  return dateString ? new Date(dateString).toLocaleString() : 'N/A'
}

export default function Activities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchActivities() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(getApiEndpoint('activities'), { signal: controller.signal })
        const payload = await response.json()
        if (!response.ok) {
          throw new Error(payload?.message || 'Unable to load activities')
        }
        setActivities(normalizeListResponse(payload))
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError(error.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
    return () => controller.abort()
  }, [])

  return (
    <div>
      <h1 className="mb-4">Activities</h1>
      <p className="text-muted">Fetches data from <code>{getApiEndpoint('activities')}</code></p>

      {loading && <div className="alert alert-secondary">Loading activities...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && activities.length === 0 && (
        <div className="alert alert-warning">No activities were found.</div>
      )}

      {activities.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Activity</th>
                <th>Points</th>
                <th>Completed</th>
                <th>User</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={activity._id ?? index}>
                  <td>{activity.type ?? activity.name ?? 'Unknown'}</td>
                  <td>{activity.points ?? '—'}</td>
                  <td>{formatDate(activity.completedAt)}</td>
                  <td>{activity.userId?.name ?? activity.user?.name ?? 'Unknown'}</td>
                  <td>{activity.teamId?.name ?? activity.team?.name ?? 'No team'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
