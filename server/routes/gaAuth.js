import express from 'express'
import { google } from 'googleapis'

const router = express.Router()

router.get('/auth-url', (req, res) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.VERCEL ? 'https://api.sparkinnovations.org/api/ga-auth/callback' : 'http://localhost:4000/api/ga-auth/callback'
    )

    const scopes = [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/analytics.readonly'
    ]

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes
    })

    res.json({ url })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query

    if (!code) {
      return res.status(400).json({ error: 'No authorization code provided' })
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.VERCEL ? 'https://api.sparkinnovations.org/api/ga-auth/callback' : 'http://localhost:4000/api/ga-auth/callback'
    )

    const { tokens } = await oauth2Client.getToken(code)

    res.json({
      message: 'Authorization successful! Copy the refresh_token below to your .env file',
      tokens,
      instructions: `Add this to your environment variables:\nGOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
