'use client'

import { useState } from 'react'
import ChatInterface from '@/components/ChatInterface'
import Sidebar from '@/components/Sidebar'
import SettingsModal from '@/components/SettingsModal'

export default function Home() {
  const [chats, setChats] = useState([
    {
      id: '1',
      title: 'Explain quantum computing',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2', 
      title: 'Write a creative story about AI',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      title: 'Plan a trip to Japan',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
    },
    {
      id: '4',
      title: 'Help with React coding',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '5',
      title: 'New Chat',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])
  const [currentChatId, setCurrentChatId] = useState('5')
  const [showSettings, setShowSettings] = useState(false)

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setChats(prev => [newChat, ...prev])
    setCurrentChatId(newChat.id)
  }

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId)
  }

  const handleDeleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId))
    if (currentChatId === chatId) {
      setCurrentChatId(chats[0]?.id || '')
    }
  }

  const handleRenameChat = (chatId: string, newTitle: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    ))
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
