import { Router } from 'express'
import { getInquiries, createInquiry, updateInquiry, deleteInquiry } from '../controllers/inquiryController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.get('/', protect, adminOnly, getInquiries)
router.post('/', createInquiry)
router.put('/:id', protect, adminOnly, updateInquiry)
router.delete('/:id', protect, adminOnly, deleteInquiry)

export default router
