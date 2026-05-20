'use client'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { useEffect, useState } from 'react'

export default function GoogleAuthProvider({ children }) {
  const [clientId, setClientId] = useState(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)

  useEffect(() => {
    if (!clientId) {
      console.warn('Google OAuth is not configured. Google sign-in will not be available.')
    }
  }, [clientId])

  if (!clientId) {
    return (
      <div className="relative">
        {children}
      </div>
    )
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  )
}



