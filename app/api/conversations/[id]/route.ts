import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { connectDB } from '@/lib/mongodb'
import Chat from '@/lib/models/Chat'
import User from '@/lib/models/User'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if Clerk is configured
    if (!process.env.CLERK_SECRET_KEY) {
      console.log('Clerk not configured, returning mock conversation')
      return NextResponse.json({
        _id: params.id,
        title: 'Updated Chat',
        updatedAt: new Date()
      })
    }

    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if MongoDB is configured
    if (!process.env.MONGODB_URI) {
      console.log('MongoDB not configured, returning mock conversation')
      return NextResponse.json({
        _id: params.id,
        title: 'Updated Chat',
        updatedAt: new Date()
      })
    }

    await connectDB()

    // Find the user by clerkId first
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { id } = params
    const body = await request.json()
    const { title, pinned, archived } = body

    const conversation = await Chat.findOneAndUpdate(
      { _id: id, userId: user._id },
      { 
        ...(title && { title }),
        ...(pinned !== undefined && { pinned }),
        ...(archived !== undefined && { archived }),
        updatedAt: new Date()
      },
      { new: true }
    )

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Error updating conversation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if Clerk is configured
    if (!process.env.CLERK_SECRET_KEY) {
      console.log('Clerk not configured, returning mock delete response')
      return NextResponse.json({ message: 'Conversation deleted successfully' })
    }

    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if MongoDB is configured
    if (!process.env.MONGODB_URI) {
      console.log('MongoDB not configured, returning mock delete response')
      return NextResponse.json({ message: 'Conversation deleted successfully' })
    }

    await connectDB()

    // Find the user by clerkId first
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { id } = params

    const conversation = await Chat.findOneAndDelete({ _id: id, userId: user._id })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Conversation deleted successfully' })
  } catch (error) {
    console.error('Error deleting conversation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
