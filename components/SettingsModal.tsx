'use client'

import { useState, useEffect } from 'react'
import { 
  X, 
  Settings, 
  Bell, 
  Palette, 
  Link, 
  Database, 
  Shield, 
  Users,
  Bot,
  Download,
  Trash2,
  Code,
  Search
} from 'lucide-react'
import Toggle from './ui/Toggle'
import Slider from './ui/Slider'
import Dropdown from './ui/Dropdown'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  
  // Settings state
  const [settings, setSettings] = useState({
    // General
    theme: 'dark',
    accentColor: 'blue',
    fontSize: 'medium',
    chatDensity: 'normal',
    language: 'en',
    spokenLanguage: 'auto-detect',
    
    // AI & Chat
    defaultModel: 'mistral',
    temperature: 0.7,
    maxTokens: 1500,
    stream: true,
    systemPrompt: '',
    
    // Notifications
    notifications: {
      email: false,
      summary: false,
      inApp: true
    },
    
    // Advanced
    betaFeatures: false,
    cacheEnabled: true,
    apiKey: ''
  })

  // Load settings on mount
  useEffect(() => {
    if (isOpen) {
      loadSettings()
    }
  }, [isOpen])

  // Apply theme on component mount
  useEffect(() => {
    if (settings.theme) {
      applyTheme(settings.theme)
    }
  }, [settings.theme])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(prev => ({
          ...prev,
          ...data,
          notifications: {
            ...prev.notifications,
            ...data.notifications
          }
        }))
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  const saveSettings = async (newSettings = settings) => {
    setLoading(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings)
      })
      
      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings }
    if (key.includes('.')) {
      const [parent, child] = key.split('.')
      ;(newSettings as any)[parent] = {
        ...(newSettings as any)[parent],
        [child]: value
      }
    } else {
      (newSettings as any)[key] = value
    }
    setSettings(newSettings)
    saveSettings(newSettings)
    
    // Apply theme changes immediately
    if (key === 'theme') {
      applyTheme(value)
    }
  }

  const applyTheme = (theme: string) => {
    const html = document.documentElement
    if (theme === 'light') {
      html.classList.remove('dark')
      html.classList.add('light')
    } else if (theme === 'dark') {
      html.classList.remove('light')
      html.classList.add('dark')
    } else if (theme === 'system') {
      html.classList.remove('light', 'dark')
      // Let system preference take over
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.classList.add('dark')
      } else {
        html.classList.add('light')
      }
    }
  }

  if (!isOpen) return null

  const settingsTabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'ai-chat', label: 'AI & Chat', icon: Bot },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'account', label: 'Account & Data', icon: Users },
    { id: 'advanced', label: 'Advanced', icon: Code }
  ]

  const modelOptions = [
    { value: 'mistral', label: 'Mistral 7B', description: 'Fast and efficient' },
    { value: 'llama', label: 'LLaMA 3.3 70B', description: 'Most capable' },
    { value: 'mixtral', label: 'Mixtral 8x7B', description: 'Balanced performance' },
    { value: 'gemma', label: 'Gemma 2 9B', description: 'Lightweight option' }
  ]

  const themeOptions = [
    { value: 'light', label: 'Light', description: 'Clean and bright' },
    { value: 'dark', label: 'Dark', description: 'Easy on the eyes' },
    { value: 'system', label: 'System', description: 'Follows your device' }
  ]

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'auto-detect', label: 'Auto-detect' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${settings.theme === 'light' ? 'bg-white' : 'bg-[#171717]'} rounded-lg w-[800px] h-[600px] flex overflow-hidden relative`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 p-2 ${settings.theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-[#2f2f2f]'} rounded transition-colors`}
        >
          <X size={20} className={settings.theme === 'light' ? 'text-gray-600' : 'text-gray-400'} />
        </button>

        {/* Left sidebar */}
        <div className={`w-64 ${settings.theme === 'light' ? 'bg-gray-50 border-r border-gray-200' : 'bg-[#1f1f1f] border-r border-[#2f2f2f]'} p-4`}>
          <h2 className={`text-lg font-semibold ${settings.theme === 'light' ? 'text-gray-900' : 'text-white'} mb-6`}>Settings</h2>
          <nav className="space-y-1">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === tab.id
                      ? settings.theme === 'light' 
                        ? 'bg-gray-200 text-gray-900' 
                        : 'bg-[#2f2f2f] text-white'
                      : settings.theme === 'light'
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        : 'text-gray-400 hover:text-white hover:bg-[#2f2f2f]'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Right content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Status indicator */}
          <div className="flex justify-end mb-4">
            {saved && (
              <div className={`flex items-center gap-2 px-3 py-1 ${settings.theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-600/20 text-green-400'} text-sm rounded-lg`}>
                <div className={`w-2 h-2 ${settings.theme === 'light' ? 'bg-green-600' : 'bg-green-400'} rounded-full`}></div>
                Settings saved
              </div>
            )}
          </div>

          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className={`text-xl font-semibold ${settings.theme === 'light' ? 'text-gray-900' : 'text-white'} mb-6`}>General</h3>
              
              <div className="space-y-6">
                <Dropdown
                  label="Theme"
                  description="Choose your preferred color scheme"
                  value={settings.theme}
                  onChange={(value) => updateSetting('theme', value)}
                  options={themeOptions}
                />

                <div className="space-y-2">
                  <label className={`${settings.theme === 'light' ? 'text-gray-900' : 'text-white'} font-medium text-sm`}>Accent Color</label>
                  <p className={`${settings.theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-xs`}>Choose your preferred accent color</p>
                  <div className="flex gap-3">
                    {['blue', 'green', 'purple'].map((color) => (
                      <button
                        key={color}
                        onClick={() => updateSetting('accentColor', color)}
                        className={`w-12 h-12 rounded-lg border-2 transition-all ${
                          settings.accentColor === color
                            ? settings.theme === 'light' ? 'border-gray-900 scale-110' : 'border-white scale-110'
                            : settings.theme === 'light' ? 'border-gray-300 hover:border-gray-500' : 'border-gray-600 hover:border-gray-400'
                        } ${
                          color === 'blue' ? 'bg-blue-500' :
                          color === 'green' ? 'bg-green-500' :
                          'bg-purple-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <Dropdown
                  label="Font Size"
                  description="Adjust text size for better readability"
                  value={settings.fontSize}
                  onChange={(value) => updateSetting('fontSize', value)}
                  options={[
                    { value: 'small', label: 'Small', description: 'Compact text' },
                    { value: 'medium', label: 'Medium', description: 'Standard size' },
                    { value: 'large', label: 'Large', description: 'Easier to read' }
                  ]}
                />

                <Dropdown
                  label="Chat Density"
                  description="Control spacing in chat messages"
                  value={settings.chatDensity}
                  onChange={(value) => updateSetting('chatDensity', value)}
                  options={[
                    { value: 'compact', label: 'Compact', description: 'More messages visible' },
                    { value: 'normal', label: 'Normal', description: 'Balanced spacing' },
                    { value: 'spacious', label: 'Spacious', description: 'More breathing room' }
                  ]}
                />

                <Dropdown
                  label="Language"
                  description="Interface language"
                  value={settings.language}
                  onChange={(value) => updateSetting('language', value)}
                  options={languageOptions}
                />

                <Dropdown
                  label="Spoken Language"
                  description="For best results, select the language you mainly speak"
                  value={settings.spokenLanguage}
                  onChange={(value) => updateSetting('spokenLanguage', value)}
                  options={languageOptions}
                />
              </div>
            </div>
          )}

          {/* AI & Chat Settings */}
          {activeTab === 'ai-chat' && (
            <div className="space-y-6">
              <h3 className={`text-xl font-semibold ${settings.theme === 'light' ? 'text-gray-900' : 'text-white'} mb-6`}>AI & Chat</h3>
              
              <div className="space-y-6">
                <Dropdown
                  label="Default Model"
                  description="Choose your preferred AI model"
                  value={settings.defaultModel}
                  onChange={(value) => updateSetting('defaultModel', value)}
                  options={modelOptions}
                />

                <Slider
                  label="Temperature"
                  description="Controls creativity and randomness (0 = focused, 2 = creative)"
                  value={settings.temperature}
                  onChange={(value) => updateSetting('temperature', value)}
                  min={0}
                  max={2}
                  step={0.1}
                />

                <Slider
                  label="Max Tokens"
                  description="Maximum length of AI responses"
                  value={settings.maxTokens}
                  onChange={(value) => updateSetting('maxTokens', value)}
                  min={100}
                  max={4000}
                  step={50}
                  unit=" tokens"
                />

                <Toggle
                  label="Streaming Responses"
                  description="Show responses word-by-word as they're generated"
                  checked={settings.stream}
                  onChange={(checked) => updateSetting('stream', checked)}
                />

                <div className="space-y-2">
                  <label className={`${settings.theme === 'light' ? 'text-gray-900' : 'text-white'} font-medium text-sm`}>System Prompt</label>
                  <p className={`${settings.theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-xs`}>Customize the AI's personality and behavior</p>
                  <textarea
                    value={settings.systemPrompt}
                    onChange={(e) => updateSetting('systemPrompt', e.target.value)}
                    placeholder="You are a helpful AI assistant..."
                    className={`w-full h-24 px-3 py-2 ${settings.theme === 'light' ? 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500' : 'bg-[#2f2f2f] border border-[#4a4a4a] text-white placeholder-gray-400'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10a37f] focus:border-transparent resize-none`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className={`text-xl font-semibold ${settings.theme === 'light' ? 'text-gray-900' : 'text-white'} mb-6`}>Notifications</h3>
              
              <div className="space-y-6">
                <Toggle
                  label="Email Notifications"
                  description="Receive updates via email"
                  checked={settings.notifications.email}
                  onChange={(checked) => updateSetting('notifications.email', checked)}
                />

                <Toggle
                  label="Weekly Summary"
                  description="Get a weekly report of your usage"
                  checked={settings.notifications.summary}
                  onChange={(checked) => updateSetting('notifications.summary', checked)}
                />

                <Toggle
                  label="In-App Notifications"
                  description="Show notifications within the app"
                  checked={settings.notifications.inApp}
                  onChange={(checked) => updateSetting('notifications.inApp', checked)}
                />
              </div>
            </div>
          )}

          {/* Account & Data Settings */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <h3 className={`text-xl font-semibold ${settings.theme === 'light' ? 'text-gray-900' : 'text-white'} mb-6`}>Account & Data</h3>
              
              <div className="space-y-6">
                <div className={`p-4 ${settings.theme === 'light' ? 'bg-gray-50' : 'bg-[#2f2f2f]'} rounded-lg`}>
                  <h4 className={`${settings.theme === 'light' ? 'text-gray-900' : 'text-white'} font-medium mb-2`}>Export Data</h4>
                  <p className={`${settings.theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-sm mb-3`}>Download all your conversations and settings</p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#10a37f] text-white text-sm rounded-lg hover:bg-[#0d8a6b] transition-colors">
                    <Download size={16} />
                    Export All Data
                  </button>
                </div>

                <div className={`p-4 ${settings.theme === 'light' ? 'bg-gray-50' : 'bg-[#2f2f2f]'} rounded-lg`}>
                  <h4 className={`${settings.theme === 'light' ? 'text-gray-900' : 'text-white'} font-medium mb-2`}>Clear Chat History</h4>
                  <p className={`${settings.theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-sm mb-3`}>Delete all your conversations (this cannot be undone)</p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
                    <Trash2 size={16} />
                    Clear All Chats
                  </button>
                </div>

                <div className={`p-4 ${settings.theme === 'light' ? 'bg-red-50 border border-red-200' : 'bg-red-900/20 border border-red-500/30'} rounded-lg`}>
                  <h4 className={`${settings.theme === 'light' ? 'text-red-700' : 'text-red-400'} font-medium mb-2`}>Delete Account</h4>
                  <p className={`${settings.theme === 'light' ? 'text-red-600' : 'text-red-300'} text-sm mb-3`}>Permanently delete your account and all data</p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
                    <Trash2 size={16} />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Settings */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <h3 className={`text-xl font-semibold ${settings.theme === 'light' ? 'text-gray-900' : 'text-white'} mb-6`}>Advanced</h3>
              
              <div className="space-y-6">
                <Toggle
                  label="Beta Features"
                  description="Enable experimental features and early access"
                  checked={settings.betaFeatures}
                  onChange={(checked) => updateSetting('betaFeatures', checked)}
                />

                <Toggle
                  label="Cache Enabled"
                  description="Use caching for faster responses"
                  checked={settings.cacheEnabled}
                  onChange={(checked) => updateSetting('cacheEnabled', checked)}
                />

                <div className="space-y-2">
                  <label className={`${settings.theme === 'light' ? 'text-gray-900' : 'text-white'} font-medium text-sm`}>Custom API Key</label>
                  <p className={`${settings.theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-xs`}>Use your own API key for enhanced limits</p>
                  <input
                    type="password"
                    value={settings.apiKey}
                    onChange={(e) => updateSetting('apiKey', e.target.value)}
                    placeholder="Enter your API key..."
                    className={`w-full px-3 py-2 ${settings.theme === 'light' ? 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500' : 'bg-[#2f2f2f] border border-[#4a4a4a] text-white placeholder-gray-400'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10a37f] focus:border-transparent`}
                  />
                </div>

                <div className={`p-4 ${settings.theme === 'light' ? 'bg-gray-50' : 'bg-[#2f2f2f]'} rounded-lg`}>
                  <h4 className={`${settings.theme === 'light' ? 'text-gray-900' : 'text-white'} font-medium mb-2`}>Reset to Defaults</h4>
                  <p className={`${settings.theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-sm mb-3`}>Restore all settings to their default values</p>
                  <button className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
                    Reset Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
