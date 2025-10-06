import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Galaxy.ai ChatGPT Clone',
  description: 'Pixel-perfect ChatGPT clone with advanced AI capabilities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.CLERK_PUBLISHABLE_KEY
  return (
    publishableKey ? (
      <ClerkProvider publishableKey={publishableKey}>
        <html lang="en" className="dark">
          <body className={inter.className}>
            <SignedOut>
              <header className="flex justify-end items-center p-4 gap-4 h-16">
                <SignInButton />
                <SignUpButton>
                  <button className="bg-[#10a37f] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                    Sign Up
                  </button>
                </SignUpButton>
              </header>
            </SignedOut>
            {children}
          </body>
        </html>
      </ClerkProvider>
    ) : (
      <html lang="en" className="dark">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    )
  )
}
