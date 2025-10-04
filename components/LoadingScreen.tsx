'use client'

import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#171717] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <div className="absolute inset-0 border-4 border-[#2f2f2f] rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#10a37f] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Galaxy.ai ChatGPT Clone</h2>
        <p className="text-gray-400">Loading{dots}</p>
      </div>
    </div>
  )
}
