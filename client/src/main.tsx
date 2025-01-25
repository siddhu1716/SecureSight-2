

// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'  
import './styles/index.css'

if (typeof global === 'undefined') {
  globalThis.global = globalThis;
}



createRoot(document.getElementById('root')!).render(
  <>
    <App />
  </>,
)


 