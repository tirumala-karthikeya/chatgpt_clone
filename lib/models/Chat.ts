import mongoose, { Schema, Document } from 'mongoose'

export interface IChat extends Document {
  userId: mongoose.Types.ObjectId
  title: string
  model: string
  settings: {
    temperature: number
    maxTokens: number
    systemPrompt?: string
  }
  isArchived: boolean
  metadata: {
    messageCount: number
    lastMessageAt: Date
  }
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
    maxlength: 200
  },
  model: {
    type: String,
    default: 'gpt-4-turbo-preview'
  },
  settings: {
    temperature: {
      type: Number,
      default: 0.7,
      min: 0,
      max: 2
    },
    maxTokens: {
      type: Number,
      default: 4000,
      min: 1,
      max: 8000
    },
    systemPrompt: {
      type: String,
      maxlength: 1000
    }
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  metadata: {
    messageCount: {
      type: Number,
      default: 0
    },
    lastMessageAt: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
})

// Indexes for better performance
ChatSchema.index({ userId: 1, createdAt: -1 })
ChatSchema.index({ userId: 1, isArchived: 1 })

export default mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema)
