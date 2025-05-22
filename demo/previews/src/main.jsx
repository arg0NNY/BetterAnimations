import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import style from '@style'

style.initialize()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
