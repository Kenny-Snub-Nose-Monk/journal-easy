import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { isMobileDevice } from '@/lib/isMobileDevice'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '划水 AI',
  description: 'AIGC 寫作，共同編輯',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isMobile = await isMobileDevice() // 這個函數是異步？

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {isMobile && (
          <div className="h-screen flex flex-col items-center justify-center">
            <p>
              <strong>划水 AI</strong> ，暫時不支持手機端
            </p>
          </div>
        )}
        {!isMobile && (
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        )}
      </body>
    </html>
  )
}
