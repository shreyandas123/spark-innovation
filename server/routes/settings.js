import { Router } from 'express'
import { getBanners, createBanner, updateBanner, toggleBannerActive, deleteBanner, getSiteSettings, updateSiteSettings } from '../controllers/settingsController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.get('/banners', getBanners)
router.post('/banners', protect, adminOnly, createBanner)
router.put('/banners/:id', protect, adminOnly, updateBanner)
router.patch('/banners/:id/toggle', protect, adminOnly, toggleBannerActive)
router.delete('/banners/:id', protect, adminOnly, deleteBanner)

router.get('/site', getSiteSettings)
router.put('/site', protect, adminOnly, updateSiteSettings)

export default router
