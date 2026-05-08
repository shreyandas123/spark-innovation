import { Router } from 'express'
import { getAllOrders, updateOrderStatus } from '../controllers/orderController.js'
import { getStats, getUsers, updateUser } from '../controllers/adminController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.get('/stats', protect, adminOnly, getStats)
router.get('/orders', protect, adminOnly, getAllOrders)
router.patch('/orders/:id/status', protect, adminOnly, updateOrderStatus)
router.get('/users', protect, adminOnly, getUsers)
router.patch('/users/:id', protect, adminOnly, updateUser)

export default router
