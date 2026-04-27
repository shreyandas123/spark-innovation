import { Router } from 'express'
import { getInquiries, createInquiry, updateInquiryStatus, deleteInquiry } from '../controllers/inquiryController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.get('/', protect, adminOnly, getInquiries)
router.post('/', createInquiry)
router.patch('/:id/status', protect, adminOnly, updateInquiryStatus)
router.delete('/:id', protect, adminOnly, deleteInquiry)

export default router
