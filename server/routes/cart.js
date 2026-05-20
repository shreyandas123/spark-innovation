import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js'
import { protect } from '../middleware/auth.js'

const router = Router()
const cartMutationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many cart requests, please slow down' },
})

router.get('/', protect, getCart)
router.post('/', cartMutationLimiter, protect, addToCart)
router.put('/:slug', cartMutationLimiter, protect, updateCartItem)
router.delete('/clear', cartMutationLimiter, protect, clearCart)
router.delete('/:slug', cartMutationLimiter, protect, removeFromCart)

export default router
