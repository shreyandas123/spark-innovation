import { Router } from 'express'
import { applyForJob, getApplications, updateApplication, deleteApplication } from '../controllers/jobController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.post('/apply', applyForJob)
router.get('/', protect, adminOnly, getApplications)
router.put('/:id', protect, adminOnly, updateApplication)
router.delete('/:id', protect, adminOnly, deleteApplication)

export default router
