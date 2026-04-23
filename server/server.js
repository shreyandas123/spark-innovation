import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import 'dotenv/config'
import authRoutes from './routes/auth.js'
import categoryRoutes from './routes/categories.js'
import productRoutes from './routes/products.js'

const app = express()
const port = process.env.PORT || 4000

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

// middlewares
app.use(express.json())
app.use(cors())

// routes
app.get('/', (req, res) => res.json({ message: 'Sparkel Sales API is running' }))
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)

app.listen(port, () => console.log(`Server running on port ${port}`))