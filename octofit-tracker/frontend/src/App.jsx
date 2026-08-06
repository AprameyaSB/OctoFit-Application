import { Routes, Route, NavLink } from 'react-router-dom'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import { getApiBaseUrl, getApiEndpoint } from './api.js'
import './App.css'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const apiBaseUrl = getApiBaseUrl()
const healthUrl = `${apiBaseUrl}/api/health`

function Home() {
  return (
    <div className="container py-5">
      <div className="row g-4 align-items-center">
        <div className="col-lg-7">
          <h1 className="display-5 fw-bold">OctoFit Tracker</h1>
          <p className="lead text-muted">
            Track workouts, grow with your team, and stay motivated with a modern multi-tier experience.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <a className="btn btn-primary btn-lg" href={healthUrl}>
              Check API health
            </a>
            <a className="btn btn-outline-secondary btn-lg" href="https://vite.dev/" target="_blank" rel="noreferrer">
              Vite docs
            </a>
          </div>
          <div className="mt-4">
            <p className="mb-1">
              <strong>API host:</strong> <code>{apiBaseUrl}</code>
            </p>
            <p className="mb-0">
              <strong>Codespace variable:</strong>{' '}
              <code>{codespaceName ?? 'unset'}</code>
            </p>
          </div>
          {!codespaceName && (
            <div className="alert alert-warning mt-4">
              <strong>VITE_CODESPACE_NAME</strong> is not defined. Add it to <code>.env.local</code> to use Codespaces preview API URLs.
            </div>
          )}
        </div>
        <div className="col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h2 className="h5">Application stack</h2>
              <ul className="list-group list-group-flush mt-3">
                <li className="list-group-item">React 19 + Vite on port 5173</li>
                <li className="list-group-item">Express + TypeScript API on port 8000</li>
                <li className="list-group-item">MongoDB via Mongoose on port 27017</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand fw-semibold">OctoFit</span>
          <div className="navbar-nav ms-auto">
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>
            <NavLink className="nav-link" to="/activities">
              Activities
            </NavLink>
            <NavLink className="nav-link" to="/leaderboard">
              Leaderboard
            </NavLink>
            <NavLink className="nav-link" to="/teams">
              Teams
            </NavLink>
            <NavLink className="nav-link" to="/users">
              Users
            </NavLink>
            <NavLink className="nav-link" to="/workouts">
              Workouts
            </NavLink>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/users" element={<Users />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
