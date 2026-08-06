/*
  Frontend API URLs use the GitHub Codespaces preview host when available:
  - https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/activities
  - https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/workouts
  - https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/users
  - https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/teams
  - https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard
*/

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim() || ''

function getDefaultApiHost() {
  if (typeof window === 'undefined') {
    return 'http://localhost:8000'
  }

  const currentHost = window.location.hostname
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    return 'http://localhost:8000'
  }

  if (currentHost.includes('.app.github.dev')) {
    return `https://${currentHost.replace('-5173.', '-8000.')}`
  }

  return 'http://localhost:8000'
}

export function getApiBaseUrl() {
  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : getDefaultApiHost()
}

export function getApiEndpoint(component) {
  return `${getApiBaseUrl()}/api/${component}`
}

export function normalizeListResponse(payload) {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.data)) return payload.data
  if (Array.isArray(payload.items)) return payload.items

  const firstArray = Object.values(payload).find(Array.isArray)
  return Array.isArray(firstArray) ? firstArray : []
}
