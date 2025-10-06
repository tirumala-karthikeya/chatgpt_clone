import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { uploadFile } from '@/lib/cloudinary'
import connectDB from '@/lib/mongodb'
import File from '@/lib/models/File'

export async function POST(request: NextRequest) {
  try {
    // Check if Clerk is configured
    if (!process.env.CLERK_SECRET_KEY) {
      console.log('Clerk not configured, returning mock upload response')
      return NextResponse.json({
        id: 'mock-file-' + Date.now(),
        url: 'https://via.placeholder.com/300x200?text=Demo+File',
        fileName: 'demo-file.txt',
        sizeBytes: 1024
      })
    }

    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if MongoDB is configured
    if (!process.env.MONGODB_URI) {
      console.log('MongoDB not configured, returning mock upload response')
      return NextResponse.json({
        id: 'mock-file-' + Date.now(),
        url: 'https://via.placeholder.com/300x200?text=Demo+File',
        fileName: 'demo-file.txt',
        sizeBytes: 1024
      })
    }

    await connectDB()

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResult = await uploadFile(buffer, `galaxy-ai/${userId}/${Date.now()}`)

    // Save file info to database
    const fileRecord = new File({
      userId,
      fileName: file.name,
      filePath: uploadResult.secure_url,
      mimeType: file.type,
      sizeBytes: file.size,
      metadata: {
        cloudinaryId: uploadResult.public_id,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height
      }
    })

    await fileRecord.save()

    return NextResponse.json({
      id: fileRecord._id,
      url: uploadResult.secure_url,
      name: file.name,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
