'use client'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { useEffect, useState } from 'react'

export default function GoogleAuthProvider({ children }) {
  const [clientId, setClientId] = useState(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)

  useEffect(() => {
    if (!clientId) {
      console.error('CRITICAL: NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing from environment variables.')
      console.log('Please ensure you have set it in your .env file or Vercel dashboard.')
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



