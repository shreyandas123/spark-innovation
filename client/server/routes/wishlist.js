import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { getWishlist, addToWishlist, removeFromWishlist, clearWishlist } from '../controllers/wishlistController.js'
import { protect } from '../middleware/auth.js'

const router = Router()
const wishlistMutationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many wishlist requests, please slow down' },
})

router.get('/', protect, getWishlist)
router.post('/', wishlistMutationLimiter, protect, addToWishlist)
router.delete('/clear', wishlistMutationLimiter, protect, clearWishlist)
router.delete('/:slug', wishlistMutationLimiter, protect, removeFromWishlist)

export default router
