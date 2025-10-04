import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    // Initialize OpenAI (you'll need to set OPENAI_API_KEY in your environment)
    const result = await streamText({
      model: openai('gpt-4-turbo-preview'),
      messages,
      temperature: 0.7,
      maxTokens: 4000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
