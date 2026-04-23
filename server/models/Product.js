import mongoose from 'mongoose'

const specSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
}, { _id: false })

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  specs: [specSchema],
  images: [{ type: String }],
  featured: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('Product', productSchema)
