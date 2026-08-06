import { useEffect, useState } from 'react'
import { getApiEndpoint, normalizeListResponse } from '../api.js'

// Codespaces preview API path example:
// https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/teams

function formatDate(dateString) {
  return dateString ? new Date(dateString).toLocaleDateString() : 'N/A'
}

export default function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchTeams() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(getApiEndpoint('teams'), { signal: controller.signal })
        const payload = await response.json()
        if (!response.ok) {
          throw new Error(payload?.message || 'Unable to load teams')
        }
        setTeams(normalizeListResponse(payload))
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError(error.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
    return () => controller.abort()
  }, [])

  return (
    <div>
      <h1 className="mb-4">Teams</h1>
      <p className="text-muted">Fetches data from <code>{getApiEndpoint('teams')}</code></p>

      {loading && <div className="alert alert-secondary">Loading teams...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && teams.length === 0 && (
        <div className="alert alert-warning">No teams were found.</div>
      )}

      {teams.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Fitness level</th>
                <th>Total points</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <tr key={team._id ?? index}>
                  <td>{team.name ?? 'Unknown'}</td>
                  <td>{team.fitnessLevel ?? '—'}</td>
                  <td>{team.totalPoints ?? '—'}</td>
                  <td>{formatDate(team.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
