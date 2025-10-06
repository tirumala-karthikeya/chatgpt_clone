import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import connectDB from '@/lib/mongodb'
import Chat from '@/lib/models/Chat'
import Message from '@/lib/models/Message'
import User from '@/lib/models/User'

// Using smaller, working HF models or alternatives

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if Clerk is configured
    if (!process.env.CLERK_SECRET_KEY) {
      console.log('Clerk not configured, returning mock messages')
      return NextResponse.json([
        {
          _id: 'mock-message-1',
          role: 'assistant',
          content: 'Hello! I\'m your AI assistant. How can I help you today?',
          status: 'completed',
          tokensUsed: 0,
          createdAt: new Date().toISOString()
        }
      ])
    }

    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if MongoDB is configured
    if (!process.env.MONGODB_URI) {
      console.log('MongoDB not configured, returning mock messages')
      return NextResponse.json([
        {
          _id: 'mock-message-1',
          role: 'assistant',
          content: 'Hello! I\'m your AI assistant. How can I help you today?',
          status: 'completed',
          tokensUsed: 0,
          createdAt: new Date().toISOString()
        }
      ])
    }

    await connectDB()

    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { id } = params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const before = searchParams.get('before')

    const conversation = await Chat.findOne({ _id: id, userId: user._id })
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const query: any = { chatId: id }
    if (before) {
      query.createdAt = { $lt: new Date(before) }
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    const formattedMessages = messages.reverse().map(msg => ({
      ...msg,
      createdAt: new Date(msg.createdAt).toISOString()
    }))

    return NextResponse.json(formattedMessages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if Clerk is configured
    if (!process.env.CLERK_SECRET_KEY) {
      console.log('Clerk not configured, returning mock response')
      return NextResponse.json({
        messageId: 'mock-message-' + Date.now(),
        status: 'completed',
        assistantMessage: {
          id: 'mock-message-' + Date.now(),
          role: 'assistant',
          content: 'Hello! I\'m your AI assistant. How can I help you today?',
          status: 'completed',
          tokensUsed: 0,
          createdAt: new Date()
        }
      })
    }

    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if MongoDB is configured
    if (!process.env.MONGODB_URI) {
      console.log('MongoDB not configured, returning mock response')
      return NextResponse.json({
        messageId: 'mock-message-' + Date.now(),
        status: 'completed',
        assistantMessage: {
          id: 'mock-message-' + Date.now(),
          role: 'assistant',
          content: 'Hello! I\'m your AI assistant. How can I help you today?',
          status: 'completed',
          tokensUsed: 0,
          createdAt: new Date()
        }
      })
    }

    await connectDB()

    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { id } = params
    const body = await request.json()
    const { 
      content, 
      systemPrompt, 
      model = 'groq', // Changed to groq as default
      maxTokens = 1500, 
      temperature = 0.7, 
      stream = false 
    } = body

    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 })
    }

    const conversation = await Chat.findOne({ _id: id, userId: user._id })
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Save user message
    const trimmedContent = content.trim()
    const userMessage = new Message({
      chatId: id,
      role: 'user',
      content: trimmedContent,
      status: 'completed',
      tokensUsed: 0,
      metadata: {}
    })

    await userMessage.save()

    // Create assistant message placeholder
    const assistantMessage = new Message({
      chatId: id,
      role: 'assistant',
      content: 'Thinking...',
      status: 'pending',
      tokensUsed: 0,
      metadata: { model, temperature, maxTokens }
    })

    await assistantMessage.save()

    // Update conversation
    await Chat.findByIdAndUpdate(id, { 
      updatedAt: new Date(),
      $inc: { 'metadata.messageCount': 1 }
    })

    if (stream) {
      return new Response(
        new ReadableStream({
          async start(controller) {
            try {
              const messages = await Message.find({ chatId: id })
                .sort({ createdAt: 1 })
                .limit(20)
                .lean()

              // Build message array for API
              const messageHistory = messages
                .filter(msg => msg.content !== 'Thinking...')
                .map(msg => ({
                  role: msg.role,
                  content: msg.content
                }))

              if (systemPrompt) {
                messageHistory.unshift({ role: 'system', content: systemPrompt })
              }

              let generatedText = ''

              // Try GROQ API (FREE and FAST!)
              if (process.env.GROQ_API_KEY) {
                try {
                  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      model: 'llama-3.3-70b-versatile', // or mixtral-8x7b-32768
                      messages: messageHistory,
                      temperature: temperature,
                      max_tokens: maxTokens,
                      stream: false
                    }),
                  })

                  if (response.ok) {
                    const data = await response.json()
                    generatedText = data.choices[0]?.message?.content || ''
                  }
                } catch (error) {
                  console.error('GROQ API error:', error)
                }
              }

              // Fallback to working HF models
              if (!generatedText && process.env.HF_API_KEY) {
                try {
                  const workingModels = [
                    'google/flan-t5-large',
                    'bigscience/bloom-560m',
                    'EleutherAI/gpt-neo-125m'
                  ]

                  for (const modelName of workingModels) {
                    try {
                      const prompt = messageHistory.map(m => `${m.role}: ${m.content}`).join('\n') + '\nassistant:'
                      
                      const hfResponse = await fetch(
                        `https://api-inference.huggingface.co/models/${modelName}`,
                        {
                          method: 'POST',
                          headers: {
                            'Authorization': `Bearer ${process.env.HF_API_KEY}`,
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            inputs: prompt,
                            parameters: {
                              max_new_tokens: maxTokens,
                              temperature: temperature,
                              return_full_text: false
                            },
                            options: {
                              wait_for_model: true
                            }
                          }),
                        }
                      )

                      if (hfResponse.ok) {
                        const result = await hfResponse.json()
                        if (Array.isArray(result) && result[0]?.generated_text) {
                          generatedText = result[0].generated_text.trim()
                          break
                        }
                      }
                    } catch (err) {
                      console.error(`Error with model ${modelName}:`, err)
                    }
                  }
                } catch (error) {
                  console.error('HF API error:', error)
                }
              }

              // Ultimate fallback
              if (!generatedText) {
                generatedText = "I apologize, but I'm currently experiencing technical difficulties. Please ensure you have set up either GROQ_API_KEY or HF_API_KEY in your environment variables. GROQ offers free, fast API access - visit https://console.groq.com to get your free API key."
              }

              // Simulate streaming
              const words = generatedText.split(' ')
              let fullContent = ''
              
              for (let i = 0; i < words.length; i++) {
                const word = words[i] + (i < words.length - 1 ? ' ' : '')
                fullContent += word
                
                controller.enqueue(new TextEncoder().encode(
                  `data: ${JSON.stringify({ content: word, messageId: assistantMessage._id })}\n\n`
                ))
                
                await new Promise(resolve => setTimeout(resolve, 30))
              }

              await Message.findByIdAndUpdate(assistantMessage._id, {
                content: fullContent,
                status: 'completed',
                tokensUsed: Math.ceil(fullContent.length / 4)
              })

              controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
              controller.close()
            } catch (error) {
              console.error('Streaming error:', error)
              await Message.findByIdAndUpdate(assistantMessage._id, {
                status: 'failed',
                content: 'Sorry, I encountered an error. Please check your API keys.',
                metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
              })
              controller.error(error)
            }
          }
        }),
        {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        }
      )
    } else {
      // Non-streaming response
      try {
        const messages = await Message.find({ chatId: id })
          .sort({ createdAt: 1 })
          .limit(20)
          .lean()

        const messageHistory = messages
          .filter(msg => msg.content !== 'Thinking...')
          .map(msg => ({
            role: msg.role,
            content: msg.content
          }))

        if (systemPrompt) {
          messageHistory.unshift({ role: 'system', content: systemPrompt })
        }

        let generatedText = ''
        let tokensUsed = 0

        // Try GROQ API first (RECOMMENDED - FREE AND FAST!)
        if (process.env.GROQ_API_KEY) {
          try {
            console.log('Using GROQ API...')
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: messageHistory,
                temperature: temperature,
                max_tokens: maxTokens,
              }),
            })

            if (response.ok) {
              const data = await response.json()
              generatedText = data.choices[0]?.message?.content || ''
              tokensUsed = data.usage?.total_tokens || 0
              console.log('GROQ response received successfully')
            } else {
              console.error('GROQ API error:', await response.text())
            }
          } catch (error) {
            console.error('GROQ API error:', error)
          }
        }

        // Fallback to working HF models
        if (!generatedText && process.env.HF_API_KEY) {
          console.log('Falling back to Hugging Face API...')
          try {
            const workingModels = [
              'google/flan-t5-large',
              'bigscience/bloom-560m',
              'EleutherAI/gpt-neo-125m'
            ]

            for (const modelName of workingModels) {
              try {
                console.log(`Trying model: ${modelName}`)
                const prompt = messageHistory.map(m => `${m.role}: ${m.content}`).join('\n') + '\nassistant:'
                
                const hfResponse = await fetch(
                  `https://api-inference.huggingface.co/models/${modelName}`,
                  {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${process.env.HF_API_KEY}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      inputs: prompt,
                      parameters: {
                        max_new_tokens: maxTokens,
                        temperature: temperature,
                        return_full_text: false
                      },
                      options: {
                        wait_for_model: true
                      }
                    }),
                  }
                )

                if (hfResponse.ok) {
                  const result = await hfResponse.json()
                  if (Array.isArray(result) && result[0]?.generated_text) {
                    generatedText = result[0].generated_text.trim()
                    tokensUsed = Math.ceil(generatedText.length / 4)
                    console.log(`Success with ${modelName}`)
                    break
                  }
                } else {
                  console.log(`Failed with ${modelName}:`, await hfResponse.text())
                }
              } catch (err) {
                console.error(`Error with model ${modelName}:`, err)
              }
            }
          } catch (error) {
            console.error('HF API error:', error)
          }
        }

        // Ultimate fallback
        if (!generatedText) {
          generatedText = "I apologize, but I'm currently unable to generate responses. Please set up your API keys:\n\n" +
            "1. GROQ (Recommended - FREE & FAST): Get your key at https://console.groq.com\n" +
            "2. Or use Hugging Face: Get your key at https://huggingface.co/settings/tokens\n\n" +
            "Add the key to your .env.local file as GROQ_API_KEY or HF_API_KEY"
          tokensUsed = 0
        }

        await Message.findByIdAndUpdate(assistantMessage._id, {
          content: generatedText,
          status: 'completed',
          tokensUsed
        })

        return NextResponse.json({
          messageId: assistantMessage._id,
          status: 'completed',
          assistantMessage: {
            id: assistantMessage._id,
            role: 'assistant',
            content: generatedText,
            status: 'completed',
            tokensUsed,
            createdAt: assistantMessage.createdAt
          }
        })
      } catch (error) {
        console.error('Non-streaming error:', error)
        await Message.findByIdAndUpdate(assistantMessage._id, {
          status: 'failed',
          content: 'Sorry, I encountered an error generating a response.',
          metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
        })

        return NextResponse.json({ 
          error: 'Failed to generate response',
          details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
      }
    }
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}