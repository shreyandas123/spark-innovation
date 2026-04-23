console.log('[SYSTEM] App is starting...')
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import 'dotenv/config'

console.log('[SYSTEM] Imports successful. Verifying environment...')
if (!process.env.MONGO_URI) console.error('[CRITICAL] MONGO_URI is missing!')
if (!process.env.JWT_SECRET) console.error('[CRITICAL] JWT_SECRET is missing!')
if (!process.env.GOOGLE_CLIENT_ID) console.error('[CRITICAL] GOOGLE_CLIENT_ID is missing!')

import authRoutes from './routes/auth.js'
import categoryRoutes from './routes/categories.js'
import productRoutes from './routes/products.js'

const app = express()
const port = process.env.PORT || 4000

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('[SYSTEM] MongoDB connected successfully'))
  .catch(err => {
    console.error('[SYSTEM] MongoDB connection error:', err)
    // Don't kill the process, so we can still see logs in Railway
  })

// middlewares
app.use(express.json())
app.use(cors())

// routes
app.get('/', (req, res) => res.json({ message: 'Sparkel Sales API is running' }))
app.get('/api/debug-db', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting']
  res.json({
    status: states[mongoose.connection.readyState],
    readyState: mongoose.connection.readyState,
    dbName: mongoose.connection.name,
    hasUri: !!process.env.MONGO_URI
  })
})
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)

app.listen(port, '0.0.0.0', () => {
  console.log(`[SYSTEM] Server is live on port ${port}`)
})