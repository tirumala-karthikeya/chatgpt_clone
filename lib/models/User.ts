import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  clerkId: string
  email: string
  name: string
  avatar?: string
  role: 'user' | 'admin'
  lastLogin?: Date
  preferences: {
    // General Settings
    theme: 'light' | 'dark' | 'system'
    accentColor: 'blue' | 'green' | 'purple'
    fontSize: 'small' | 'medium' | 'large'
    chatDensity: 'compact' | 'normal' | 'spacious'
    language: string
    spokenLanguage: string
    
    // AI & Chat Settings
    defaultModel: string
    temperature: number
    maxTokens: number
    stream: boolean
    systemPrompt?: string
    
    // Notifications
    notifications: {
      email: boolean
      summary: boolean
      inApp: boolean
    }
    
    // Advanced Settings
    betaFeatures: boolean
    cacheEnabled: boolean
    apiKey?: string
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
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  lastLogin: {
    type: Date
  },
  preferences: {
    // General Settings
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    accentColor: {
      type: String,
      enum: ['blue', 'green', 'purple'],
      default: 'blue'
    },
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    },
    chatDensity: {
      type: String,
      enum: ['compact', 'normal', 'spacious'],
      default: 'normal'
    },
    language: {
      type: String,
      default: 'en'
    },
    spokenLanguage: {
      type: String,
      default: 'auto-detect'
    },
    
    // AI & Chat Settings
    defaultModel: {
      type: String,
      default: 'mistral'
    },
    temperature: {
      type: Number,
      default: 0.7,
      min: 0,
      max: 2
    },
    maxTokens: {
      type: Number,
      default: 1500,
      min: 100,
      max: 4000
    },
    stream: {
      type: Boolean,
      default: true
    },
    systemPrompt: {
      type: String,
      default: ''
    },
    
    // Notifications
    notifications: {
      email: {
        type: Boolean,
        default: false
      },
      summary: {
        type: Boolean,
        default: false
      },
      inApp: {
        type: Boolean,
        default: true
      }
    },
    
    // Advanced Settings
    betaFeatures: {
      type: Boolean,
      default: false
    },
    cacheEnabled: {
      type: Boolean,
      default: true
    },
    apiKey: {
      type: String,
      default: ''
    }
  }
}, {
  timestamps: true
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
