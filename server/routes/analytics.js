import express from 'express'
import { getAnalyticsData } from '../controllers/analyticsController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

// Get analytics data (admin only)
router.get('/data', protect, adminOnly, getAnalyticsData)

export default router
