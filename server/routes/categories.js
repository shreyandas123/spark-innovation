import { Router } from 'express'
import { getCategories, createCategory, deleteCategory } from '../controllers/categoryController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.get('/', getCategories)
router.post('/', protect, adminOnly, createCategory)
router.delete('/:slug', protect, adminOnly, deleteCategory)

export default router
