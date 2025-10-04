'use client'

import { useState } from 'react'
import { 
  Plus, 
  MessageSquare, 
  Settings, 
  User, 
  Menu, 
  X,
  Edit3,
  Trash2,
  Search,
  BookOpen,
  Folder,
  Grid3X3,
  ChevronDown,
  Star,
  HelpCircle,
  LogOut,
  Sparkles,
  Clock,
  Shield,
  Database,
  Users
} from 'lucide-react'

interface Chat {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
}

interface SidebarProps {
  chats?: Chat[]
  currentChatId?: string
  onNewChat?: () => void
  onSelectChat?: (chatId: string) => void
  onDeleteChat?: (chatId: string) => void
  onRenameChat?: (chatId: string, newTitle: string) => void
  onOpenSettings?: () => void
}

export default function Sidebar({ 
  chats = [], 
  currentChatId, 
  onNewChat, 
  onSelectChat, 
  onDeleteChat,
  onRenameChat,
  onOpenSettings
}: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [editingChat, setEditingChat] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  const handleRename = (chatId: string, currentTitle: string) => {
    setEditingChat(chatId)
    setEditingTitle(currentTitle)
  }

  const handleSaveRename = () => {
    if (editingChat && editingTitle.trim() && onRenameChat) {
      onRenameChat(editingChat, editingTitle.trim())
    }
    setEditingChat(null)
    setEditingTitle('')
  }

  const handleCancelRename = () => {
    setEditingChat(null)
    setEditingTitle('')
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#2f2f2f] rounded-lg text-white"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <div className={`chatgpt-sidebar ${isMobileOpen ? 'open' : ''} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">
            {/* Header with New Chat */}
            <div className="p-4">
              <button
                onClick={onNewChat}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#2f2f2f] hover:bg-[#3f3f3f] text-white transition-colors"
              >
                <Plus size={20} />
                <span>New chat</span>
              </button>
            </div>

            {/* Search Chats */}
            <div className="px-4 pb-4">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#2f2f2f] text-gray-300 transition-colors">
                <Search size={20} />
                <span>Search chats</span>
              </button>
            </div>

            {/* Library */}
            <div className="px-4 pb-4">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#2f2f2f] text-gray-300 transition-colors">
                <BookOpen size={20} />
                <span>Library</span>
              </button>
            </div>

            {/* Projects */}
            <div className="px-4 pb-4">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#2f2f2f] text-gray-300 transition-colors">
                <Folder size={20} />
                <span>Projects</span>
              </button>
            </div>

            {/* GPTs Section */}
            <div className="px-4 pb-2">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">GPTs</h3>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#2f2f2f] text-gray-300 transition-colors">
                <Grid3X3 size={20} />
                <span>Explore</span>
              </button>
            </div>

            {/* GPT List */}
            <div className="px-4 pb-4 space-y-1">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2f2f2f] text-gray-300 transition-colors cursor-pointer">
                <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                  <span className="text-xs text-white font-bold">AI</span>
                </div>
                <span className="text-sm">AI PDF Drive: Chat, Create, ...</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2f2f2f] text-gray-300 transition-colors cursor-pointer">
                <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                  <Star size={14} className="text-white" />
                </div>
                <span className="text-sm">Tarot Reading</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2f2f2f] text-gray-300 transition-colors cursor-pointer">
                <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-xs text-white">🌿</span>
                </div>
                <span className="text-sm">image generator</span>
              </div>
            </div>

            {/* Chats Section */}
            <div className="px-4 pb-2">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Chats</h3>
            </div>

            {/* Chat history */}
            <div className="px-4 pb-4">
              <div className="space-y-1">
                {chats
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .map((chat) => (
                  <div
                    key={chat.id}
                    className={`group relative flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      currentChatId === chat.id
                        ? 'bg-[#2f2f2f] text-white'
                        : 'hover:bg-[#2f2f2f] text-gray-300'
                    }`}
                    onClick={() => onSelectChat?.(chat.id)}
                  >
                    {editingChat === chat.id ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onBlur={handleSaveRename}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename()
                          if (e.key === 'Escape') handleCancelRename()
                        }}
                        className="flex-1 bg-transparent text-white text-sm outline-none"
                        autoFocus
                      />
                    ) : (
                      <span className="flex-1 text-sm truncate">
                        {chat.title}
                      </span>
                    )}

                    {/* Action buttons */}
                    {currentChatId === chat.id && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRename(chat.id, chat.title)
                          }}
                          className="p-1 hover:bg-[#4a4a4a] rounded"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteChat?.(chat.id)
                          }}
                          className="p-1 hover:bg-[#4a4a4a] rounded text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fixed User section with dropdown */}
          <div className="p-4 border-t border-[#2f2f2f] relative">
            <div 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#2f2f2f] transition-colors cursor-pointer"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <div className="w-8 h-8 bg-[#10a37f] rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  J.T karthikeya
                </p>
                <p className="text-xs text-gray-400 truncate">
                  Free
                </p>
              </div>
              <button className="px-2 py-1 bg-[#2f2f2f] text-white text-xs rounded hover:bg-[#3f3f3f] transition-colors">
                Upgrade
              </button>
              <ChevronDown size={16} className="text-gray-400" />
            </div>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className="absolute bottom-16 left-4 right-4 bg-[#2f2f2f] rounded-lg shadow-lg border border-[#4a4a4a] z-50">
                <div className="p-2">
                  <div className="flex items-center gap-3 p-2 text-sm text-gray-300">
                    <User size={16} />
                    j.karthikeya2004@gmail.com
                  </div>
                  
                  <div className="border-t border-[#4a4a4a] my-2"></div>
                  
                  <div className="space-y-1">
                    <button className="w-full flex items-center gap-3 p-2 text-sm text-gray-300 hover:bg-[#3f3f3f] rounded transition-colors">
                      <Sparkles size={16} />
                      Upgrade plan
                    </button>
                    <button className="w-full flex items-center gap-3 p-2 text-sm text-gray-300 hover:bg-[#3f3f3f] rounded transition-colors">
                      <Clock size={16} />
                      Personalization
                    </button>
                    <button 
                      onClick={() => {
                        setShowProfileDropdown(false)
                        onOpenSettings?.()
                      }}
                      className="w-full flex items-center gap-3 p-2 text-sm text-gray-300 hover:bg-[#3f3f3f] rounded transition-colors"
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                  </div>
                  
                  <div className="border-t border-[#4a4a4a] my-2"></div>
                  
                  <div className="space-y-1">
                    <button className="w-full flex items-center gap-3 p-2 text-sm text-gray-300 hover:bg-[#3f3f3f] rounded transition-colors">
                      <HelpCircle size={16} />
                      Help
                    </button>
                    <button className="w-full flex items-center gap-3 p-2 text-sm text-gray-300 hover:bg-[#3f3f3f] rounded transition-colors">
                      <LogOut size={16} />
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}
