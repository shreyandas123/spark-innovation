import Category from '../models/Category.js'

export const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ name: 1 })
  res.json({ categories })
}

export const createCategory = async (req, res) => {
  const { name, slug, icon, description } = req.body
  if (!name || !slug)
    return res.status(400).json({ message: 'name and slug are required' })

  const existing = await Category.findOne({ slug })
  if (existing) return res.status(409).json({ message: 'Slug already exists' })

  const category = await Category.create({ name, slug, icon, description })
  res.status(201).json({ category })
}

export const updateCategory = async (req, res) => {
  const { name, slug, icon, description } = req.body
  const updates = { name, slug, icon, description }
  Object.keys(updates).forEach(k => updates[k] === undefined && delete updates[k])

  if (updates.slug && updates.slug !== req.params.slug) {
    const existing = await Category.findOne({ slug: updates.slug })
    if (existing) return res.status(409).json({ message: 'Slug already exists' })
  }

  const category = await Category.findOneAndUpdate(
    { slug: req.params.slug },
    updates,
    { new: true, runValidators: true }
  )
  if (!category) return res.status(404).json({ message: 'Category not found' })
  res.json({ category })
}

export const deleteCategory = async (req, res) => {
  const category = await Category.findOneAndDelete({ slug: req.params.slug })
  if (!category) return res.status(404).json({ message: 'Category not found' })
  res.json({ message: 'Category deleted' })
}
