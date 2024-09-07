import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import GamePage from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GamePage />
  </StrictMode>,
)
