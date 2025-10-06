'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface DropdownOption {
  value: string
  label: string
  description?: string
}

interface DropdownProps {
  value: string
  onChange: (value: string) => void
  options: DropdownOption[]
  label?: string
  description?: string
  placeholder?: string
}

export default function Dropdown({ 
  value, 
  onChange, 
  options, 
  label, 
  description, 
  placeholder = 'Select an option' 
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = options.find(option => option.value === value)

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-white font-medium text-sm">
          {label}
        </label>
      )}
      {description && (
        <p className="text-gray-400 text-xs">
          {description}
        </p>
      )}
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#2f2f2f] border border-[#4a4a4a] rounded-lg text-white text-sm hover:bg-[#3f3f3f] transition-colors"
        >
          <span>{selectedOption?.label || placeholder}</span>
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#2f2f2f] border border-[#4a4a4a] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-[#3f3f3f] transition-colors ${
                  value === option.value ? 'bg-[#10a37f] text-white' : 'text-gray-300'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                {option.description && (
                  <div className="text-xs text-gray-400 mt-1">
                    {option.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
