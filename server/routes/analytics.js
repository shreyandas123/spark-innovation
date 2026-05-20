import express from 'express'
import { getAnalyticsData } from '../controllers/analyticsController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Get analytics data (admin only)
router.get('/data', authMiddleware, getAnalyticsData)

export default router
