import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Taskaroo - Habit Tracking App',
  description: 'Track your daily habits and build a better routine',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navigation />
            <main className="container mx-auto px-4 md:px-8 py-6">
              {children}
            </main>
        </Providers>
      </body>
    </html>
  )
} 