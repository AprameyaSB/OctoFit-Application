import { useEffect, useState } from 'react'
import { getApiEndpoint, normalizeListResponse } from '../api.js'

// Codespaces preview API path example:
// https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard

function formatDate(dateString) {
  return dateString ? new Date(dateString).toLocaleString() : 'N/A'
}

export default function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchLeaderboard() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(getApiEndpoint('leaderboard'), { signal: controller.signal })
        const payload = await response.json()
        if (!response.ok) {
          throw new Error(payload?.message || 'Unable to load leaderboard')
        }
        setEntries(normalizeListResponse(payload))
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError(error.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
    return () => controller.abort()
  }, [])

  return (
    <div>
      <h1 className="mb-4">Leaderboard</h1>
      <p className="text-muted">Fetches data from <code>{getApiEndpoint('leaderboard')}</code></p>

      {loading && <div className="alert alert-secondary">Loading leaderboard...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && entries.length === 0 && (
        <div className="alert alert-warning">No leaderboard entries were found.</div>
      )}

      {entries.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Fitness level</th>
                <th>Total points</th>
                <th>Workouts</th>
                <th>Last activity</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry.userId ?? index}>
                  <td>{index + 1}</td>
                  <td>{entry.name ?? entry.user?.name ?? 'Unknown'}</td>
                  <td>{entry.fitnessLevel ?? entry.user?.fitnessLevel ?? 'Unknown'}</td>
                  <td>{entry.totalPoints ?? '—'}</td>
                  <td>{entry.workoutCount ?? entry.activities ?? '—'}</td>
                  <td>{formatDate(entry.lastActivity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
