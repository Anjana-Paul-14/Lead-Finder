// apps/v4/components/Providers.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/components/theme-provider'
import { ActiveThemeProvider } from '@/components/active-theme'
import { Toaster } from '@/registry/new-york-v4/ui/sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ActiveThemeProvider>
          {children}
          <Toaster />
        </ActiveThemeProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
