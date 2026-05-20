import { Router } from 'express'
import { placeOrder, getMyOrders, getOrderById } from '../controllers/orderController.js'
import { protect } from '../middleware/auth.js'
import rateLimit from 'express-rate-limit'

const router = Router()

const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' }
})

router.post('/', orderLimiter, protect, placeOrder)
router.get('/me', protect, getMyOrders)
router.get('/:id', protect, getOrderById)

export default router
