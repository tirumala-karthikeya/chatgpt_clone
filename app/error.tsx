'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="chatgpt-container">
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-white mb-4">Something went wrong!</h1>
          <p className="text-gray-400 mb-6">
            We encountered an error while loading the application. This might be due to missing environment variables or configuration issues.
          </p>
          <div className="space-y-4">
            <button
              onClick={reset}
              className="bg-[#10a37f] text-white rounded-lg px-6 py-2 font-medium hover:bg-[#0d8a6b] transition-colors"
            >
              Try again
            </button>
            <div className="text-sm text-gray-500">
              Error ID: {error.digest || 'unknown'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
