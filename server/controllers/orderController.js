import Order from '../models/Order.js'

export const placeOrder = async (req, res) => {
  const { items, shipping, paymentMethod, total } = req.body

  if (!items?.length)
    return res.status(400).json({ message: 'Order must have at least one item' })
  if (!shipping?.name || !shipping?.email || !shipping?.phone || !shipping?.address)
    return res.status(400).json({ message: 'Shipping name, email, phone and address are required' })
  if (!paymentMethod)
    return res.status(400).json({ message: 'Payment method is required' })

  const order = await Order.create({
    user: req.user._id,
    items,
    shipping,
    paymentMethod,
    total,
  })

  res.status(201).json({ order })
}

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json({ orders })
}

export const getOrderById = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
  if (!order) return res.status(404).json({ message: 'Order not found' })
  res.json({ order })
}

export const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 })
  res.json({ orders })
}

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  )
  if (!order) return res.status(404).json({ message: 'Order not found' })
  res.json({ order })
}
