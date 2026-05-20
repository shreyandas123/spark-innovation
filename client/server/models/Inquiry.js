import mongoose from 'mongoose'

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, maxlength: 200 },
  phone: { type: String, trim: true, maxlength: 20 },
  product: { type: String, trim: true, maxlength: 200 },
  message: { type: String, required: true, maxlength: 2000 },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Closed'],
    default: 'New',
  },
}, { timestamps: true })

export default mongoose.model('Inquiry', inquirySchema)
