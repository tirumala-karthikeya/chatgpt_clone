'use client'

import { useState } from 'react'
import { 
  X, 
  Settings, 
  Bell, 
  Palette, 
  Link, 
  Database, 
  Shield, 
  Users,
  ChevronDown,
  Play,
  Volume2
} from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState('general')
  const [theme, setTheme] = useState('dark')
  const [accentColor, setAccentColor] = useState('blue')
  const [language, setLanguage] = useState('auto-detect')
  const [spokenLanguage, setSpokenLanguage] = useState('auto-detect')
  const [voice, setVoice] = useState('ember')

  if (!isOpen) return null

  const settingsTabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'personalization', label: 'Personalization', icon: Palette },
    { id: 'connectors', label: 'Connectors', icon: Link },
    { id: 'data-controls', label: 'Data controls', icon: Database },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'parental-controls', label: 'Parental controls', icon: Users },
    { id: 'account', label: 'Account', icon: Users }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#171717] rounded-lg w-[800px] h-[600px] flex overflow-hidden relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-[#2f2f2f] rounded transition-colors"
        >
          <X size={20} className="text-gray-400" />
        </button>

        {/* Left sidebar */}
        <div className="w-64 bg-[#1f1f1f] border-r border-[#2f2f2f] p-4">
          <h2 className="text-lg font-semibold text-white mb-6">Settings</h2>
          <nav className="space-y-1">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#2f2f2f] text-white'
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
          {activeTab === 'general' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">General</h3>
              
              <div className="space-y-6">
                {/* Theme */}
                <div className="flex items-center justify-between py-3 border-b border-[#2f2f2f]">
                  <div>
                    <label className="text-white font-medium">Theme</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300 capitalize">{theme}</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>

                {/* Accent color */}
                <div className="flex items-center justify-between py-3 border-b border-[#2f2f2f]">
                  <div>
                    <label className="text-white font-medium">Accent color</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full bg-${accentColor}-500`}></div>
                    <span className="text-gray-300 capitalize">{accentColor}</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>

                {/* Language */}
                <div className="flex items-center justify-between py-3 border-b border-[#2f2f2f]">
                  <div>
                    <label className="text-white font-medium">Language</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">{language}</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>

                {/* Spoken language */}
                <div className="flex items-center justify-between py-3 border-b border-[#2f2f2f]">
                  <div>
                    <label className="text-white font-medium">Spoken language</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">{spokenLanguage}</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>

                {/* Spoken language description */}
                <p className="text-sm text-gray-400">
                  For best results, select the language you mainly speak. If it's not listed, it may still be supported via auto-detection.
                </p>

                {/* Voice */}
                <div className="flex items-center justify-between py-3 border-b border-[#2f2f2f]">
                  <div>
                    <label className="text-white font-medium">Voice</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-[#2f2f2f] rounded transition-colors">
                      <Play size={16} className="text-gray-400" />
                    </button>
                    <span className="text-gray-300 capitalize">{voice}</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Notifications</h3>
              <p className="text-gray-400">Notification settings will be available here.</p>
            </div>
          )}

          {activeTab === 'personalization' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Personalization</h3>
              <p className="text-gray-400">Personalization settings will be available here.</p>
            </div>
          )}

          {activeTab === 'connectors' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Connectors</h3>
              <p className="text-gray-400">Connector settings will be available here.</p>
            </div>
          )}

          {activeTab === 'data-controls' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Data controls</h3>
              <p className="text-gray-400">Data control settings will be available here.</p>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Security</h3>
              <p className="text-gray-400">Security settings will be available here.</p>
            </div>
          )}

          {activeTab === 'parental-controls' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Parental controls</h3>
              <p className="text-gray-400">Parental control settings will be available here.</p>
            </div>
          )}

          {activeTab === 'account' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Account</h3>
              <p className="text-gray-400">Account settings will be available here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
