import { Routes, Route, NavLink } from 'react-router-dom'
import './App.css'

const currentHost = window.location.hostname
const apiBaseUrl = currentHost === 'localhost' || currentHost === '127.0.0.1'
  ? 'http://localhost:8000'
  : currentHost.includes('.app.github.dev')
    ? `https://${currentHost.replace('-5173.', '-8000.')}`
    : 'http://localhost:8000'

function Home() {
  return (
    <div className="container py-5">
      <div className="row g-4 align-items-center">
        <div className="col-lg-7">
          <h1 className="display-5 fw-bold">OctoFit Tracker</h1>
          <p className="lead text-muted">
            Track workouts, grow with your team, and stay motivated with a modern multi-tier experience.
          </p>
          <div className="d-flex gap-3">
            <a className="btn btn-primary btn-lg" href={`${apiBaseUrl}/api/health`}>
              Check API health
            </a>
            <a className="btn btn-outline-secondary btn-lg" href="https://vite.dev/" target="_blank" rel="noreferrer">
              Vite docs
            </a>
          </div>
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
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
