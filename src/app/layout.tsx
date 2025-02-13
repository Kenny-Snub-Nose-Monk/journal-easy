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
  const isMobile = await isMobileDevice()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {isMobile && (
          <div className="fixed bottom-0 left-0 w-full text-center text-base py-2 bg-yellow-500">
            <p>暫不支持移動端，請使用 PC 瀏覽器訪問~</p>
          </div>
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
