import mongoose, { Schema, Document } from 'mongoose'

export interface IFile extends Document {
  userId: mongoose.Types.ObjectId
  fileName: string
  filePath: string
  mimeType: string
  sizeBytes: number
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

const FileSchema = new Schema<IFile>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  sizeBytes: {
    type: Number,
    required: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
})

// Indexes for better performance
FileSchema.index({ userId: 1, createdAt: -1 })
FileSchema.index({ mimeType: 1 })

export default mongoose.models.File || mongoose.model<IFile>('File', FileSchema)
