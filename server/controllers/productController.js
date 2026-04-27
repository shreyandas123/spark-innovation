import Product from '../models/Product.js'

export const getProducts = async (req, res) => {
  const filter = {}
  if (req.query.category) filter.category = req.query.category
  if (req.query.featured === 'true') filter.featured = true

  const products = await Product.find(filter).sort({ createdAt: -1 })
  res.json({ products })
}

export const getProductBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json({ product })
}

export const createProduct = async (req, res) => {
  const { name, slug, category, price, description, specs, images, featured, inStock } = req.body
  if (!name || !slug || !category || !price)
    return res.status(400).json({ message: 'name, slug, category and price are required' })

  const existing = await Product.findOne({ slug })
  if (existing) return res.status(409).json({ message: 'Slug already exists' })

  const product = await Product.create({ name, slug, category, price, description, specs, images, featured, inStock })
  res.status(201).json({ product })
}

export const updateProduct = async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { slug: req.params.slug },
    req.body,
    { new: true, runValidators: true }
  )
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json({ product })
}

export const deleteProduct = async (req, res) => {
  const product = await Product.findOneAndDelete({ slug: req.params.slug })
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json({ message: 'Product deleted' })
}
