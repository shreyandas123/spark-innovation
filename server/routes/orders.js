import { Router } from 'express'
import { placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } from '../controllers/orderController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.post('/', protect, placeOrder)
router.get('/my', protect, getMyOrders)
router.get('/:id', protect, getOrderById)
router.get('/', protect, adminOnly, getAllOrders)
router.patch('/:id/status', protect, adminOnly, updateOrderStatus)

export default router
