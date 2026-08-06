import { useEffect, useState } from 'react'
import { getApiEndpoint, normalizeListResponse } from '../api.js'

export default function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchWorkouts() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(getApiEndpoint('workouts'), { signal: controller.signal })
        const payload = await response.json()
        if (!response.ok) {
          throw new Error(payload?.message || 'Unable to load workouts')
        }
        setWorkouts(normalizeListResponse(payload))
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError(error.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchWorkouts()
    return () => controller.abort()
  }, [])

  return (
    <div>
      <h1 className="mb-4">Workouts</h1>
      <p className="text-muted">Fetches data from <code>{getApiEndpoint('workouts')}</code></p>

      {loading && <div className="alert alert-secondary">Loading workouts...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && workouts.length === 0 && (
        <div className="alert alert-warning">No workouts were found.</div>
      )}

      {workouts.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout, index) => (
                <tr key={workout._id ?? index}>
                  <td>{workout.name ?? 'Unknown'}</td>
                  <td>{workout.description ?? 'No description'}</td>
                  <td>{workout.createdAt ? new Date(workout.createdAt).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
