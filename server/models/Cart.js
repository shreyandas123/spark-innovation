import { Schema, model } from 'mongoose'

const cartItemSchema = new Schema({
  slug:     { type: String, required: true },
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  image:    { type: String },
}, { _id: false })

const cartSchema = new Schema({
  user:  { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
}, { timestamps: true })

export default model('Cart', cartSchema)
