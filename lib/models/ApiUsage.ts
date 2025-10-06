import mongoose, { Schema, Document } from 'mongoose'

export interface IApiUsage extends Document {
  userId: mongoose.Types.ObjectId
  date: Date
  tokensUsed: number
  cost: number
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

const ApiUsageSchema = new Schema<IApiUsage>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  tokensUsed: {
    type: Number,
    default: 0
  },
  cost: {
    type: Number,
    default: 0
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
})

// Indexes for better performance
ApiUsageSchema.index({ userId: 1, date: 1 })
ApiUsageSchema.index({ date: 1 })

export default mongoose.models.ApiUsage || mongoose.model<IApiUsage>('ApiUsage', ApiUsageSchema)
