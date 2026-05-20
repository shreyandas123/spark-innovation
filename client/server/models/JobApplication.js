import { Schema, model } from 'mongoose'

const jobApplicationSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, maxlength: 200 },
    phone: { type: String, required: true, maxlength: 20 },
    position: { type: String, required: true, maxlength: 200 },
    message: { type: String, maxlength: 2000 },
    status: { type: String, enum: ['Pending', 'Reviewed', 'Rejected'], default: 'Pending' },
  },
  { timestamps: true }
)

export default model('JobApplication', jobApplicationSchema)
