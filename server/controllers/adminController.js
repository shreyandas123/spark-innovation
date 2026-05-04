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
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json({ users })
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const { role } = req.body
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
