import { Router } from 'express'
import { submitPayment, getMyPayments, getAllPayments, updatePaymentStatus } from '../controllers/qrPaymentController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

// User routes
router.post('/', protect, submitPayment)
router.get('/me', protect, getMyPayments)

// Admin routes
router.get('/admin', protect, adminOnly, getAllPayments)
router.patch('/admin/:id', protect, adminOnly, updatePaymentStatus)

export default router
