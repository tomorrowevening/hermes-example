import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { IS_DEV } from './constants'

createRoot(document.getElementById('root')!).render(
  <>
    {IS_DEV ? (
      <>
        <App />
      </>
    ) : (
      <StrictMode>
        <App />
      </StrictMode>
    )}
  </>,
)
