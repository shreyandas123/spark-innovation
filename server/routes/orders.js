import { Router } from 'express'
import { placeOrder, getMyOrders, getOrderById } from '../controllers/orderController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.post('/', protect, placeOrder)
router.get('/me', protect, getMyOrders)
router.get('/:id', protect, getOrderById)

export default router
