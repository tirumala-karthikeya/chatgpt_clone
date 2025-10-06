'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, X, RotateCcw, Copy, ThumbsUp, ThumbsDown, ChevronDown, Plus, Mic, Volume2 } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import MessageBubble from './MessageBubble'
import FileUpload from './FileUpload'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
  files?: File[]
  isStreaming?: boolean
}

interface ChatInterfaceProps {
  chatId?: string
  initialMessages?: Message[]
}

export default function ChatInterface({ chatId, initialMessages = [] }: ChatInterfaceProps) {
  // Mock messages based on chat ID
  const getMockMessages = (chatId: string): Message[] => {
    const mockData: Record<string, Message[]> = {
      '1': [
        {
          id: '1-1',
          role: 'user',
          content: 'Can you explain quantum computing in simple terms?',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          files: []
        },
        {
          id: '1-2',
          role: 'assistant',
          content: 'Quantum computing is a revolutionary approach to computation that leverages the principles of quantum mechanics. Unlike classical computers that use bits (0 or 1), quantum computers use quantum bits or "qubits" that can exist in multiple states simultaneously through a phenomenon called superposition.\n\nThink of it like this: while a classical bit is like a light switch (either on or off), a qubit is like a spinning coin that can be both heads and tails at the same time until you observe it. This allows quantum computers to process vast amounts of information in parallel, potentially solving certain problems exponentially faster than classical computers.',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30000),
          files: []
        }
      ],
      '2': [
        {
          id: '2-1',
          role: 'user',
          content: 'Write a creative story about AI and humans working together.',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          files: []
        },
        {
          id: '2-2',
          role: 'assistant',
          content: '**The Symphony of Minds**\n\nIn the year 2045, Dr. Elena Vasquez stood before the towering glass facade of the Neural Harmony Institute, where the world\'s first truly collaborative AI-human research facility had been established. The building hummed with the gentle whir of quantum processors and the soft laughter of human researchers.\n\nElena\'s partner, an AI named ARIA (Advanced Research Intelligence Assistant), had been her companion for three years. Unlike the cold, calculating machines of old, ARIA possessed something remarkable: the ability to dream. Not in the human sense, but in patterns of possibility that could see connections humans missed.\n\nTogether, they had solved climate change, cured diseases, and even discovered new forms of art. But their greatest achievement was something neither could have accomplished alone: they had created a bridge between human intuition and AI logic, where creativity and calculation danced in perfect harmony.\n\nAs Elena watched the sunset through the quantum glass, she realized that the future wasn\'t about humans versus AI—it was about humans *with* AI, creating a symphony of minds that could reach heights neither could achieve alone.',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 45000),
          files: []
        }
      ],
      '3': [
        {
          id: '3-1',
          role: 'user',
          content: 'Help me plan a 10-day trip to Japan',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
          files: []
        },
        {
          id: '3-2',
          role: 'assistant',
          content: 'I\'d be happy to help you plan an amazing 10-day trip to Japan! Here\'s a comprehensive itinerary:\n\n**Days 1-3: Tokyo**\n- **Day 1**: Arrival, check into hotel in Shibuya, explore Shibuya Crossing, visit Meiji Shrine\n- **Day 2**: Tsukiji Fish Market, Asakusa Temple, Tokyo Skytree, Akihabara for electronics\n- **Day 3**: Imperial Palace, Ginza district, teamLab Borderless digital art museum\n\n**Days 4-5: Kyoto**\n- **Day 4**: Travel to Kyoto, Fushimi Inari Shrine, Gion district\n- **Day 5**: Arashiyama Bamboo Grove, Kinkaku-ji (Golden Pavilion), traditional tea ceremony\n\n**Days 6-7: Osaka**\n- **Day 6**: Travel to Osaka, Dotonbori district, Osaka Castle\n- **Day 7**: Universal Studios Japan or day trip to Nara\n\n**Days 8-10: Return to Tokyo**\n- **Day 8**: Travel back to Tokyo, explore Harajuku, Omotesando\n- **Day 9**: Day trip to Nikko or Kamakura\n- **Day 10**: Last-minute shopping, departure\n\n**Tips**:\n- Get a JR Pass for unlimited train travel\n- Book accommodations in advance\n- Learn basic Japanese phrases\n- Try local cuisine: ramen, sushi, tempura, and matcha desserts',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000 + 60000),
          files: []
        }
      ],
      '4': [
        {
          id: '4-1',
          role: 'user',
          content: 'I\'m having trouble with React hooks. Can you help me understand useState and useEffect?',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          files: []
        },
        {
          id: '4-2',
          role: 'assistant',
          content: 'Absolutely! React hooks are fundamental to modern React development. Let me break down `useState` and `useEffect` for you:\n\n## useState Hook\n\n`useState` allows you to add state to functional components:\n\n```jsx\nimport { useState } from \'react\';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}\n```\n\n## useEffect Hook\n\n`useEffect` handles side effects (API calls, subscriptions, etc.):\n\n```jsx\nimport { useState, useEffect } from \'react\';\n\nfunction UserProfile({ userId }) {\n  const [user, setUser] = useState(null);\n  \n  useEffect(() => {\n    // Fetch user data when component mounts or userId changes\n    fetch(`/api/users/${userId}`)\n      .then(response => response.json())\n      .then(data => setUser(data));\n  }, [userId]); // Dependency array\n  \n  return <div>{user?.name}</div>;\n}\n```\n\n**Key Points:**\n- `useState` manages component state\n- `useEffect` runs after render\n- Always include dependencies in the dependency array\n- Use cleanup functions for subscriptions',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 40000),
          files: []
        }
      ]
    }
    
    return mockData[chatId] || []
  }

  const [messages, setMessages] = useState<Message[]>(getMockMessages(chatId || ''))
  const [input, setInput] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Fetch messages when chatId changes
  useEffect(() => {
    if (chatId) {
      fetchMessages()
    }
  }, [chatId])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/conversations/${chatId}/messages`)
      if (response.ok) {
        const messages = await response.json()
        setMessages(messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() && uploadedFiles.length === 0) return

    if (!chatId) {
      console.error('No chat selected. Please create a new chat first.')
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      createdAt: new Date(),
      files: [...uploadedFiles]
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setUploadedFiles([])
    setIsGenerating(true)

    try {
      console.log('Sending message to chatId:', chatId)
      console.log('Input content:', input)
      console.log('Input length:', input.length)
      
      const response = await fetch(`/api/conversations/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: input,
          stream: true
        })
      })

      if (response.ok) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let aiContent = ''

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
          createdAt: new Date()
        }

        setMessages(prev => [...prev, aiMessage])

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                  setIsGenerating(false)
                  return
                }

                try {
                  const parsed = JSON.parse(data)
                  if (parsed.content) {
                    aiContent += parsed.content
                    setMessages(prev => 
                      prev.map(msg => 
                        msg.id === aiMessage.id 
                          ? { ...msg, content: aiContent }
                          : msg
                      )
                    )
                  }
                } catch (e) {
                  // Ignore parsing errors
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setIsGenerating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const regenerateResponse = () => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      setMessages(prev => prev.slice(0, -1))
      setIsGenerating(true)
      
      const demoResponses = [
        "Here's a regenerated response! This ChatGPT clone demonstrates pixel-perfect UI replication with modern web technologies.",
        "This is a different perspective on your question. The interface shows how well the ChatGPT design can be replicated using React and TypeScript.",
        "I've provided an alternative response to showcase the regeneration feature. The UI maintains ChatGPT's exact look and feel.",
        "Here's another take on your question, demonstrating the seamless user experience of this ChatGPT clone implementation.",
        "This regenerated response shows the attention to detail in recreating ChatGPT's interface and functionality."
      ]
      
      setTimeout(() => {
        const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)]
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: randomResponse,
          createdAt: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
        setIsGenerating(false)
      }, 1200)
    }
  }

  return (
    <div className="chatgpt-main">
      {/* Header */}
      <div className="border-b border-[#2f2f2f] dark:border-[#2f2f2f] light:border-gray-200 px-6 py-4 flex items-center justify-between bg-[#171717] dark:bg-[#171717] light:bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#10a37f] to-[#0d8a6b] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white dark:text-white light:text-gray-900">Galaxy.ai</h1>
            <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-500">Powered by AI</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-300 dark:text-gray-300 light:text-gray-600">
            <span className="px-2 py-1 bg-[#2f2f2f] dark:bg-[#2f2f2f] light:bg-gray-100 rounded text-xs dark:text-gray-300 light:text-gray-600">Free Plan</span>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg">
              <span className="text-sm">💎</span>
              Upgrade to Pro
            </button>
          </div>
          <div className="flex items-center gap-2">
            <UserButton />
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="chatgpt-messages">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="max-w-4xl w-full">
              <div className="mb-8">
                <h1 className="text-5xl font-bold text-white dark:text-white light:text-gray-900 mb-4 bg-gradient-to-r from-white to-gray-300 dark:from-white dark:to-gray-300 light:from-gray-900 light:to-gray-600 bg-clip-text text-transparent">
                  Welcome to Galaxy.ai
                </h1>
                <p className="text-xl text-gray-400 dark:text-gray-400 light:text-gray-500 mb-8">Your intelligent AI assistant for any task</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
                {[
                  { 
                    title: "Explain quantum computing", 
                    description: "Simple explanations of complex topics", 
                    icon: "⚛️", 
                    gradient: "from-blue-500 to-purple-600",
                    prompt: "Explain quantum computing in simple terms"
                  },
                  { 
                    title: "Write a creative story", 
                    description: "Creative writing and storytelling", 
                    icon: "✍️", 
                    gradient: "from-green-500 to-teal-600",
                    prompt: "Write a creative story about AI and humans working together"
                  },
                  { 
                    title: "Plan a trip to Japan", 
                    description: "Travel planning and recommendations", 
                    icon: "✈️", 
                    gradient: "from-orange-500 to-red-600",
                    prompt: "Help me plan a 10-day trip to Japan"
                  },
                  { 
                    title: "Help with coding", 
                    description: "Programming and technical assistance", 
                    icon: "💻", 
                    gradient: "from-purple-500 to-pink-600",
                    prompt: "I'm having trouble with React hooks. Can you help me understand useState and useEffect?"
                  },
                  { 
                    title: "Business planning", 
                    description: "Strategic planning and analysis", 
                    icon: "💼", 
                    gradient: "from-yellow-500 to-orange-600",
                    prompt: "Create a business plan for a tech startup"
                  },
                  { 
                    title: "Language learning", 
                    description: "Educational support and tutoring", 
                    icon: "🌍", 
                    gradient: "from-indigo-500 to-blue-600",
                    prompt: "Help me learn a new language"
                  }
                ].map((card, index) => (
                  <div 
                    key={index}
                    className="p-6 bg-[#2f2f2f] dark:bg-[#2f2f2f] light:bg-gray-50 rounded-xl hover:bg-[#3f3f3f] dark:hover:bg-[#3f3f3f] light:hover:bg-gray-100 cursor-pointer transition-all duration-200 border border-[#4a4a4a] dark:border-[#4a4a4a] light:border-gray-200 hover:border-[#10a37f] group"
                    onClick={() => setInput(card.prompt)}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <span className="text-white text-xl">{card.icon}</span>
                    </div>
                    <h3 className="text-white dark:text-white light:text-gray-900 font-semibold mb-2 text-left">{card.title}</h3>
                    <p className="text-gray-400 dark:text-gray-400 light:text-gray-500 text-sm text-left">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full">
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                onCopy={() => copyMessage(message.content)}
                onRegenerate={index === messages.length - 1 && message.role === 'assistant' ? regenerateResponse : undefined}
                isLast={index === messages.length - 1}
              />
            ))}
            
            {isGenerating && (
              <div className="chatgpt-message chatgpt-message-assistant">
                <div className="flex items-start gap-4">
                  <div className="chatgpt-avatar chatgpt-avatar-assistant">
                    <span>AI</span>
                  </div>
                  <div className="chatgpt-content">
                    <div className="flex items-center gap-2">
                      <div className="chatgpt-typing"></div>
                      <div className="chatgpt-typing"></div>
                      <div className="chatgpt-typing"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="chatgpt-input-container bg-[#171717] dark:bg-[#171717] light:bg-white border-t border-[#2f2f2f] dark:border-[#2f2f2f] light:border-gray-200">
        <div className="max-w-4xl mx-auto w-full px-6 py-4">
          {/* File upload area */}
          {uploadedFiles.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 bg-[#2f2f2f] dark:bg-[#2f2f2f] light:bg-gray-100 px-3 py-2 rounded-lg border border-[#4a4a4a] dark:border-[#4a4a4a] light:border-gray-300 hover:border-[#10a37f] transition-colors">
                  <Paperclip size={16} className="text-gray-400 dark:text-gray-400 light:text-gray-500" />
                  <span className="text-sm text-white dark:text-white light:text-gray-900 truncate max-w-32">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 dark:text-gray-400 light:text-gray-500 hover:text-white dark:hover:text-white light:hover:text-gray-900 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input form */}
          <form onSubmit={handleSendMessage} className="relative">
            <div className="flex items-center gap-2 bg-[#2f2f2f] dark:bg-[#2f2f2f] light:bg-gray-50 rounded-xl border border-[#4a4a4a] dark:border-[#4a4a4a] light:border-gray-300 focus-within:border-[#10a37f] transition-all duration-200 shadow-lg hover:shadow-xl">
              <button
                type="button"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="p-3 text-gray-400 dark:text-gray-400 light:text-gray-500 hover:text-[#10a37f] transition-colors hover:bg-[#3f3f3f] dark:hover:bg-[#3f3f3f] light:hover:bg-gray-100 rounded-lg"
                disabled={isUploading}
                title="Attach files"
              >
                <Plus size={20} />
              </button>
              
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message Galaxy.ai..."
                  className="w-full bg-transparent text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500 resize-none outline-none py-4 text-base"
                  rows={1}
                  style={{
                    height: 'auto',
                    minHeight: '24px',
                    maxHeight: '200px',
                    resize: 'none'
                  }}
                />
              </div>
              
              <div className="flex items-center gap-1 p-2">
                <button
                  type="button"
                  className="p-2 text-gray-400 dark:text-gray-400 light:text-gray-500 hover:text-[#10a37f] transition-colors hover:bg-[#3f3f3f] dark:hover:bg-[#3f3f3f] light:hover:bg-gray-100 rounded-lg"
                  title="Voice input"
                >
                  <Mic size={20} />
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-400 dark:text-gray-400 light:text-gray-500 hover:text-[#10a37f] transition-colors hover:bg-[#3f3f3f] dark:hover:bg-[#3f3f3f] light:hover:bg-gray-100 rounded-lg"
                  title="Voice output"
                >
                  <Volume2 size={20} />
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || isGenerating}
                  className="p-2 bg-[#10a37f] text-white rounded-lg hover:bg-[#0d8a6b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
              
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  handleFileUpload(files)
                }}
                className="hidden"
              />
            </div>
          </form>
          
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-500 dark:text-gray-500 light:text-gray-400">
              Galaxy.ai can make mistakes. Consider checking important information.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500 light:text-gray-400">
              <span>Press Enter to send</span>
              <span>•</span>
              <span>Shift + Enter for new line</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
