import Banner from '../models/Banner.js'
import SiteSettings from '../models/SiteSettings.js'

// Banners
export const getBanners = async (req, res) => {
  const banners = await Banner.find().sort({ order: 1, createdAt: -1 })
  res.json({ banners })
}

export const createBanner = async (req, res) => {
  const { title, subtitle, description, image, link, active, order } = req.body
  if (!title || !image)
    return res.status(400).json({ message: 'title and image are required' })
  const banner = await Banner.create({ title, subtitle, description, image, link, active, order })
  res.status(201).json({ banner })
}

export const updateBanner = async (req, res) => {
  const { title, subtitle, description, image, link, active, order } = req.body
  const updates = { title, subtitle, description, image, link, active, order }
  Object.keys(updates).forEach(k => updates[k] === undefined && delete updates[k])

  const banner = await Banner.findByIdAndUpdate(
    req.params.id,
    updates,
    { returnDocument: 'after', runValidators: true }
  )
  if (!banner) return res.status(404).json({ message: 'Banner not found' })
  res.json({ banner })
}

export const toggleBannerActive = async (req, res) => {
  const banner = await Banner.findById(req.params.id)
  if (!banner) return res.status(404).json({ message: 'Banner not found' })
  banner.active = !banner.active
  await banner.save()
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
  const { websiteName, metaDescription, heroHeadline, heroSubheadline, topBarText, logo, favicon, phone, email, address, mapsUrl, social } = req.body
  const updates = {}

  if (websiteName !== undefined) updates.websiteName = websiteName
  if (metaDescription !== undefined) updates.metaDescription = metaDescription
  if (heroHeadline !== undefined) updates.heroHeadline = heroHeadline
  if (heroSubheadline !== undefined) updates.heroSubheadline = heroSubheadline
  if (topBarText !== undefined) updates.topBarText = topBarText
  if (logo !== undefined) updates.logo = logo
  if (favicon !== undefined) updates.favicon = favicon
  if (phone !== undefined) updates.phone = phone
  if (email !== undefined) updates.email = email
  if (address !== undefined) updates.address = address
  if (mapsUrl !== undefined) updates.mapsUrl = mapsUrl
  if (req.body.upiQrCode !== undefined) updates.upiQrCode = req.body.upiQrCode

  // dot notation so partial social updates don't wipe the other social fields
  if (social && typeof social === 'object') {
    for (const [key, val] of Object.entries(social)) {
      if (val !== undefined) updates[`social.${key}`] = val
    }
  }

  const settings = await SiteSettings.findOneAndUpdate(
    {},
    { $set: updates },
    { returnDocument: 'after', upsert: true, runValidators: true }
  )
  res.json({ settings })
}
