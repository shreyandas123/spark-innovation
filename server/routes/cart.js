import { Router } from 'express'
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/', protect, getCart)
router.post('/', protect, addToCart)
router.put('/:slug', protect, updateCartItem)
router.delete('/clear', protect, clearCart)
router.delete('/:slug', protect, removeFromCart)

export default router
