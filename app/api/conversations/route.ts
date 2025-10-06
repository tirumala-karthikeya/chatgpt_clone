import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { connectDB } from '@/lib/mongodb'
import Chat from '@/lib/models/Chat'
import User from '@/lib/models/User'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      console.log('No userId found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('User ID from Clerk:', userId)
    await connectDB()

    // Find the user by clerkId first
    const user = await User.findOne({ clerkId: userId })
    console.log('User found in DB:', user ? 'Yes' : 'No')
    if (!user) {
      console.log('User not found in database, userId:', userId)
      return NextResponse.json({ error: 'User not found. Please refresh the page.' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const conversations = await Chat.find({ userId: user._id })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Chat.countDocuments({ userId: user._id })

    return NextResponse.json({
      conversations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Find the user by clerkId first
    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { title = 'New Chat' } = body

    const conversation = new Chat({
      userId: user._id,
      title,
      pinned: false,
      archived: false,
      metadata: {}
    })

    await conversation.save()

    return NextResponse.json(conversation, { status: 201 })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
