'use client'

import { Toaster } from 'sonner'

export function ToastProvider() {
  return (
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
  )
} 