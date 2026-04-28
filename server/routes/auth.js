import { Router } from 'express'
import { register, login, googleAuth, getMe, updateProfile, updatePassword } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/google', googleAuth)
router.get('/me', protect, getMe)
router.put('/me', protect, updateProfile)
router.put('/profile', protect, updateProfile)
router.put('/password', protect, updatePassword)

export default router
