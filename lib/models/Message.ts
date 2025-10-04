import mongoose, { Schema, Document } from 'mongoose'

export interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId
  role: 'user' | 'assistant' | 'system'
  content: string
  isEdited: boolean
  parentMessageId?: mongoose.Types.ObjectId
  metadata: {
    tokens: number
    model: string
    finishReason?: string
  }
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
  isEdited: {
    type: Boolean,
    default: false
  },
  parentMessageId: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  },
  metadata: {
    tokens: {
      type: Number,
      default: 0
    },
    model: {
      type: String,
      default: 'gpt-4-turbo-preview'
    },
    finishReason: {
      type: String,
      enum: ['stop', 'length', 'content_filter', 'function_call']
    }
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
