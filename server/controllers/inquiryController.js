import Inquiry from '../models/Inquiry.js'

export const getInquiries = async (req, res) => {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 })
  res.json({ inquiries })
}

export const createInquiry = async (req, res) => {
  const { name, email, phone, product, message } = req.body
  if (!name || !email || !message)
    return res.status(400).json({ message: 'name, email and message are required' })

  const inquiry = await Inquiry.create({ name, email, phone, product, message })
  res.status(201).json({ inquiry })
}

export const updateInquiryStatus = async (req, res) => {
  const { status } = req.body
  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  )
  if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' })
  res.json({ inquiry })
}

export const deleteInquiry = async (req, res) => {
  const inquiry = await Inquiry.findByIdAndDelete(req.params.id)
  if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' })
  res.json({ message: 'Inquiry deleted' })
}
