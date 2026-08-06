import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'

// Vite exposes environment variables with the VITE_ prefix via import.meta.env.
// Define VITE_CODESPACE_NAME in .env.local for Codespaces preview API routing.
const codespaceName = import.meta.env.VITE_CODESPACE_NAME || 'local'
console.debug('VITE_CODESPACE_NAME:', codespaceName)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
