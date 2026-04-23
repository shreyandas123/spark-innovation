import Product from '../models/Product.js'

export const getProducts = async (req, res) => {
  const filter = {}
  if (req.query.category) filter.category = req.query.category
  if (req.query.featured === 'true') filter.featured = true

  const products = await Product.find(filter).sort({ createdAt: -1 })
  res.json({ products })
}
