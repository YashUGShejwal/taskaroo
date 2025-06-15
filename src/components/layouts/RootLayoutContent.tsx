'use client'

import { Toaster } from 'sonner'
import Navbar from '@/components/Navbar'

export default function RootLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 md:px-8 py-6">
        {children}
      </main>
      <Toaster 
        position="top-right"
        expand={true}
        richColors
        closeButton
        theme="light"
        style={{ zIndex: 9999 }}
        toastOptions={{
          duration: 3000,
          style: {
            background: 'white',
            color: 'black',
            border: '1px solid #e5e7eb',
          },
        }}
      />
    </div>
  )
} 