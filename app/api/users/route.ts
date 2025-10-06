import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { sendWelcomeEmail } from '@/lib/email'
import { setCache } from '@/lib/redis'

export async function POST(request: NextRequest) {
  try {
    // Check if Clerk is configured
    if (!process.env.CLERK_SECRET_KEY) {
      console.log('Clerk not configured, returning mock user')
      return NextResponse.json({ 
        _id: 'mock-user-id',
        clerkId: 'mock-clerk-id',
        email: 'demo@example.com',
        name: 'Demo User',
        role: 'user'
      })
    }

    const { userId } = auth()
    
    if (!userId) {
      console.log('No userId found in user creation')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Creating user for Clerk ID:', userId)
    
    // Check if MongoDB is configured
    if (!process.env.MONGODB_URI) {
      console.log('MongoDB not configured, returning mock user')
      return NextResponse.json({ 
        _id: 'mock-user-id',
        clerkId: userId,
        email: 'demo@example.com',
        name: 'Demo User',
        role: 'user'
      })
    }
    
    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ clerkId: userId })
    if (existingUser) {
      console.log('User already exists:', existingUser._id)
      return NextResponse.json(existingUser)
    }

    // Parse request body
    const body = await request.json()
    console.log('User data from request:', body)

    // Create new user
    const user = new User({
      clerkId: userId,
      email: body?.email || '',
      name: body?.name || 'User',
      avatar: body?.avatar || '',
      role: 'user',
      preferences: {
        theme: 'system',
        language: 'en',
        model: 'gpt-3.5-turbo',
        maxTokens: 1500,
        temperature: 0.7,
        notificationsEnabled: true
      }
    })

    console.log('Saving user to database...')
    await user.save()
    console.log('User saved successfully:', user._id)

    // Cache user data
    await setCache(`user:${userId}`, user, 3600)

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name)
    } catch (emailError) {
      console.error('Welcome email failed:', emailError)
      // Don't fail user creation if email fails
    }

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
