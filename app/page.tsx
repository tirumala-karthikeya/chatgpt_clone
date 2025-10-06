'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import ChatInterface from '@/components/ChatInterface'
import Sidebar from '@/components/Sidebar'
import SettingsModal from '@/components/SettingsModal'

interface Chat {
  _id: string
  title: string
  createdAt: Date
  updatedAt: Date
}

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

function AuthedHome() {
  const { user, isLoaded } = useUser()
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch conversations from API
  useEffect(() => {
    if (isLoaded && user) {
      createUserIfNeeded()
    }
  }, [isLoaded, user])

  const createUserIfNeeded = async () => {
    try {
      // First try to create/get user
      const userResponse = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user?.emailAddresses[0]?.emailAddress,
          name: user?.fullName,
          avatar: user?.imageUrl
        })
      })
      
      if (userResponse.ok) {
        // User created/found, now fetch conversations
        fetchConversations()
      } else {
        console.error('Failed to create user')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error creating user:', error)
      setLoading(false)
    }
  }

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      if (response.ok) {
        const data = await response.json()
        setChats(data.conversations)
        if (data.conversations.length > 0 && !currentChatId) {
          setCurrentChatId(data.conversations[0]._id)
        } else if (data.conversations.length === 0) {
          // Auto-create a new chat if none exist
          console.log('No conversations found, creating new chat...')
          await handleNewChat()
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = async () => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'New Chat' })
      })
      
      if (response.ok) {
        const newChat = await response.json()
        setChats(prev => [newChat, ...prev])
        setCurrentChatId(newChat._id)
      }
    } catch (error) {
      console.error('Error creating new chat:', error)
    }
  }

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId)
  }

  const handleDeleteChat = async (chatId: string) => {
    try {
      const response = await fetch(`/api/conversations/${chatId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setChats(prev => prev.filter(chat => chat._id !== chatId))
        if (currentChatId === chatId) {
          setCurrentChatId(chats[0]?._id || '')
        }
      }
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }

  const handleRenameChat = async (chatId: string, newTitle: string) => {
    try {
      const response = await fetch(`/api/conversations/${chatId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle })
      })
      
      if (response.ok) {
        setChats(prev => prev.map(chat => 
          chat._id === chatId ? { ...chat, title: newTitle } : chat
        ))
      }
    } catch (error) {
      console.error('Error renaming chat:', error)
    }
  }

  if (!isLoaded) {
    return (
      <div className="chatgpt-container">
        <div className="flex items-center justify-center h-screen">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="chatgpt-container">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Welcome to Galaxy.ai</h1>
            <p className="text-gray-400 mb-8">Please sign in using the button above to continue</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="chatgpt-container">
        <div className="flex items-center justify-center h-screen">
          <div className="text-white">Loading conversations...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="chatgpt-container">
      <Sidebar 
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        onOpenSettings={() => setShowSettings(true)}
      />
      <ChatInterface chatId={currentChatId} />
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  )
}

function PublicHome() {
  return (
    <div className="chatgpt-container">
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Welcome to Galaxy.ai</h1>
          <p className="text-gray-400 mb-8">Sign-in is disabled or not configured. Please add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to enable authentication.</p>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return clerkEnabled ? <AuthedHome /> : <PublicHome />
}
