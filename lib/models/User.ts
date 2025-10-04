import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  clerkId: string
  email: string
  name: string
  avatar?: string
  preferences: {
    theme: 'light' | 'dark'
    language: string
    model: string
  }
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  clerkId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'dark'
    },
    language: {
      type: String,
      default: 'en'
    },
    model: {
      type: String,
      default: 'gpt-4-turbo-preview'
    }
  }
}, {
  timestamps: true
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
