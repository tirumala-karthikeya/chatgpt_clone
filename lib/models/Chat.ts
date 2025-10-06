import mongoose, { Schema, Document } from 'mongoose'

export interface IChat extends Document {
  userId: mongoose.Types.ObjectId
  title: string
  pinned: boolean
  archived: boolean
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

const ChatSchema = new Schema<IChat>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    default: 'New Chat',
    maxlength: 200
  },
  pinned: {
    type: Boolean,
    default: false
  },
  archived: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
})

// Indexes for better performance
ChatSchema.index({ userId: 1, updatedAt: -1 })
ChatSchema.index({ userId: 1, archived: 1 })
ChatSchema.index({ userId: 1, pinned: 1 })

export default mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema)
