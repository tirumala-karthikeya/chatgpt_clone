import mongoose, { Schema, Document } from 'mongoose'

export interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId
  role: 'user' | 'assistant' | 'system'
  content: string
  tokensUsed: number
  status: 'pending' | 'streaming' | 'completed' | 'failed'
  metadata: Record<string, any>
  files: Array<{
    id: string
    name: string
    type: string
    url: string
    size: number
  }>
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>({
  chatId: {
    type: Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
    index: true
  },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  tokensUsed: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'streaming', 'completed', 'failed'],
    default: 'completed'
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  files: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    }
  }]
}, {
  timestamps: true
})

// Indexes for better performance
MessageSchema.index({ chatId: 1, createdAt: 1 })
MessageSchema.index({ chatId: 1, role: 1 })

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema)
