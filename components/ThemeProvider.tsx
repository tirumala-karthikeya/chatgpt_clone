'use client'

import { useEffect } from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
  theme?: string
}

export default function ThemeProvider({ children, theme = 'dark' }: ThemeProviderProps) {
  useEffect(() => {
    const html = document.documentElement
    
    // Remove existing theme classes
    html.classList.remove('light', 'dark')
    
    if (theme === 'light') {
      html.classList.add('light')
    } else if (theme === 'dark') {
      html.classList.add('dark')
    } else if (theme === 'system') {
      // Let system preference take over
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.classList.add('dark')
      } else {
        html.classList.add('light')
      }
    }
  }, [theme])

  return <>{children}</>
}
