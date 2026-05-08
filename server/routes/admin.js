import { Router } from 'express'
import { getAllOrders, updateOrderStatus } from '../controllers/orderController.js'
import { getStats, getUsers, updateUser } from '../controllers/adminController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

// Stats
router.get('/stats', protect, adminOnly, getStats)

// Orders
router.get('/orders', protect, adminOnly, getAllOrders)
router.patch('/orders/:id/status', protect, adminOnly, updateOrderStatus)

// User Management
router.get('/users', protect, adminOnly, getUsers)
router.patch('/users/:id', protect, adminOnly, updateUser)

export default router

