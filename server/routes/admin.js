import { Router } from 'express'
import { getAllOrders, updateOrderStatus } from '../controllers/orderController.js'
import { getStats } from '../controllers/adminController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.get('/stats', protect, adminOnly, getStats)
router.get('/orders', protect, adminOnly, getAllOrders)
router.patch('/orders/:id/status', protect, adminOnly, updateOrderStatus)

export default router
