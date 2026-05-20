import mongoose from 'mongoose'

const qrPaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  screenshot: { type: String, required: true },
  senderPhone: { type: String, required: true },
  senderUpi: { type: String, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  },
  adminNote: { type: String },
}, { timestamps: true })

qrPaymentSchema.index({ user: 1 })
qrPaymentSchema.index({ order: 1 })
qrPaymentSchema.index({ status: 1 })

export default mongoose.model('QrPayment', qrPaymentSchema)
