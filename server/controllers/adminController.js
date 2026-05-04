import Product from '../models/Product.js'
import Inquiry from '../models/Inquiry.js'
import User from '../models/User.js'
import Banner from '../models/Banner.js'

export const getStats = async (req, res, next) => {
  try {
    const [
      totalProducts,
      inStockProducts,
      totalInquiries,
      inquiriesByStatus,
      totalUsers,
      activeBanners,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ inStock: true }),
      Inquiry.countDocuments(),
      Inquiry.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      User.countDocuments(),
      Banner.countDocuments({ active: true }),
    ])

    res.json({
      products: { total: totalProducts, inStock: inStockProducts },
      inquiries: {
        total: totalInquiries,
        byStatus: Object.fromEntries(inquiriesByStatus.map(s => [s._id, s.count])),
      },
      banners: { active: activeBanners },
      users: { total: totalUsers },
    })
  } catch (error) {
    next(error)
  }
}

export const getUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(100, parseInt(req.query.limit) || 20)
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ])

    res.json({ users, total, page, pages: Math.ceil(total / limit) })
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const { role } = req.body
    if (!role) return res.status(400).json({ message: 'role is required' })
    if (!['admin', 'user'].includes(role))
      return res.status(400).json({ message: 'role must be admin or user' })

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch (error) {
    next(error)
  }
}
