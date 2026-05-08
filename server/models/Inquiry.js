import mongoose from 'mongoose'

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  product: { type: String, trim: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Closed'],
    default: 'New',
  },
}, { timestamps: true })

export default mongoose.model('Inquiry', inquirySchema)
