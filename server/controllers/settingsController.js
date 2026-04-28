import Banner from '../models/Banner.js'
import SiteSettings from '../models/SiteSettings.js'

// Banners
export const getBanners = async (req, res) => {
  const banners = await Banner.find().sort({ order: 1, createdAt: -1 })
  res.json({ banners })
}

export const createBanner = async (req, res) => {
  const { title, image, link, active, order } = req.body
  if (!title || !image)
    return res.status(400).json({ message: 'title and image are required' })
  const banner = await Banner.create({ title, image, link, active, order })
  res.status(201).json({ banner })
}

export const updateBanner = async (req, res) => {
  const { title, image, link, active, order } = req.body
  const updates = { title, image, link, active, order }
  Object.keys(updates).forEach(k => updates[k] === undefined && delete updates[k])

  const banner = await Banner.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  )
  if (!banner) return res.status(404).json({ message: 'Banner not found' })
  res.json({ banner })
}

export const deleteBanner = async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id)
  if (!banner) return res.status(404).json({ message: 'Banner not found' })
  res.json({ message: 'Banner deleted' })
}

// Site settings — single document, upserted on first update
export const getSiteSettings = async (req, res) => {
  const settings = await SiteSettings.findOne()
  res.json({ settings: settings || {} })
}

export const updateSiteSettings = async (req, res) => {
  const { websiteName, metaDescription, heroHeadline, heroSubheadline, phone, email, address, mapsUrl, social } = req.body
  const updates = { websiteName, metaDescription, heroHeadline, heroSubheadline, phone, email, address, mapsUrl, social }
  Object.keys(updates).forEach(k => updates[k] === undefined && delete updates[k])

  const settings = await SiteSettings.findOneAndUpdate(
    {},
    updates,
    { new: true, upsert: true, runValidators: true }
  )
  res.json({ settings })
}
