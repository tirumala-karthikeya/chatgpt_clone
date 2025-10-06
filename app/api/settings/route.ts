import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const revalidate = 0
import { auth } from '@clerk/nextjs'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      // General settings
      theme: user.preferences.theme,
      accentColor: user.preferences.accentColor,
      fontSize: user.preferences.fontSize,
      chatDensity: user.preferences.chatDensity,
      language: user.preferences.language,
      spokenLanguage: user.preferences.spokenLanguage,
      
      // AI & Chat settings
      defaultModel: user.preferences.defaultModel,
      temperature: user.preferences.temperature,
      maxTokens: user.preferences.maxTokens,
      stream: user.preferences.stream,
      systemPrompt: user.preferences.systemPrompt,
      
      // Notifications
      notifications: user.preferences.notifications,
      
      // Advanced settings
      betaFeatures: user.preferences.betaFeatures,
      cacheEnabled: user.preferences.cacheEnabled,
      apiKey: user.preferences.apiKey
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()
    
    // Build update object dynamically
    const updateFields: any = {}
    
    // General settings
    if (body.theme !== undefined) updateFields['preferences.theme'] = body.theme
    if (body.accentColor !== undefined) updateFields['preferences.accentColor'] = body.accentColor
    if (body.fontSize !== undefined) updateFields['preferences.fontSize'] = body.fontSize
    if (body.chatDensity !== undefined) updateFields['preferences.chatDensity'] = body.chatDensity
    if (body.language !== undefined) updateFields['preferences.language'] = body.language
    if (body.spokenLanguage !== undefined) updateFields['preferences.spokenLanguage'] = body.spokenLanguage
    
    // AI & Chat settings
    if (body.defaultModel !== undefined) updateFields['preferences.defaultModel'] = body.defaultModel
    if (body.temperature !== undefined) updateFields['preferences.temperature'] = body.temperature
    if (body.maxTokens !== undefined) updateFields['preferences.maxTokens'] = body.maxTokens
    if (body.stream !== undefined) updateFields['preferences.stream'] = body.stream
    if (body.systemPrompt !== undefined) updateFields['preferences.systemPrompt'] = body.systemPrompt
    
    // Notifications
    if (body.notifications !== undefined) {
      if (body.notifications.email !== undefined) updateFields['preferences.notifications.email'] = body.notifications.email
      if (body.notifications.summary !== undefined) updateFields['preferences.notifications.summary'] = body.notifications.summary
      if (body.notifications.inApp !== undefined) updateFields['preferences.notifications.inApp'] = body.notifications.inApp
    }
    
    // Advanced settings
    if (body.betaFeatures !== undefined) updateFields['preferences.betaFeatures'] = body.betaFeatures
    if (body.cacheEnabled !== undefined) updateFields['preferences.cacheEnabled'] = body.cacheEnabled
    if (body.apiKey !== undefined) updateFields['preferences.apiKey'] = body.apiKey

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $set: updateFields },
      { new: true }
    )

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      // General settings
      theme: user.preferences.theme,
      accentColor: user.preferences.accentColor,
      fontSize: user.preferences.fontSize,
      chatDensity: user.preferences.chatDensity,
      language: user.preferences.language,
      spokenLanguage: user.preferences.spokenLanguage,
      
      // AI & Chat settings
      defaultModel: user.preferences.defaultModel,
      temperature: user.preferences.temperature,
      maxTokens: user.preferences.maxTokens,
      stream: user.preferences.stream,
      systemPrompt: user.preferences.systemPrompt,
      
      // Notifications
      notifications: user.preferences.notifications,
      
      // Advanced settings
      betaFeatures: user.preferences.betaFeatures,
      cacheEnabled: user.preferences.cacheEnabled,
      apiKey: user.preferences.apiKey
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
