import Cart from '../models/Cart.js'

export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
  res.json({ items: cart ? cart.items : [] })
}

export const addToCart = async (req, res) => {
  const { slug, name, price, quantity = 1, image } = req.body
  if (!slug || !name || price == null)
    return res.status(400).json({ message: 'slug, name and price are required' })

  const qty = Math.max(1, parseInt(quantity) || 1)

  let cart = await Cart.findOne({ user: req.user._id })
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [{ slug, name, price, quantity: qty, image }] })
    return res.status(201).json({ items: cart.items })
  }

  const existing = cart.items.find(i => i.slug === slug)
  if (existing) {
    existing.quantity += qty
  } else {
    cart.items.push({ slug, name, price, quantity: qty, image })
  }

  await cart.save()
  res.json({ items: cart.items })
}

export const updateCartItem = async (req, res) => {
  const { quantity } = req.body
  if (!quantity || quantity < 1)
    return res.status(400).json({ message: 'quantity must be at least 1' })

  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) return res.status(404).json({ message: 'Cart not found' })

  const item = cart.items.find(i => i.slug === req.params.slug)
  if (!item) return res.status(404).json({ message: 'Item not in cart' })

  item.quantity = quantity
  await cart.save()
  res.json({ items: cart.items })
}

export const removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) return res.status(404).json({ message: 'Cart not found' })

  const before = cart.items.length
  cart.items = cart.items.filter(i => i.slug !== req.params.slug)
  if (cart.items.length === before)
    return res.status(404).json({ message: 'Item not in cart' })

  await cart.save()
  res.json({ items: cart.items })
}

export const clearCart = async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id })
  res.json({ message: 'Cart cleared' })
}
