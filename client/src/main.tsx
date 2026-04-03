import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { GoogleOAuthProvider } from '@react-oauth/google'
import '@fontsource-variable/geist/index.css'
import '@fontsource/bebas-neue/index.css'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from '@/context/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  </StrictMode>,
)
