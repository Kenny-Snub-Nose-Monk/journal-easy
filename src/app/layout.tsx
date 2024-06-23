import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { isMobileDevice } from '@/lib/isMobileDevice'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '划水 AI',
  description: 'AIGC 知识库，AI 写作，协同编辑',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isMobile = await isMobileDevice() // 这个函数是异步的？？？

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {isMobile && (
          <div className="h-screen flex flex-col items-center justify-center">
            <p>
              <strong>划水 AI</strong> ，暂不支持移动端浏览器~
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
          </ThemeProvider>
        )}
      </body>
    </html>
  )
}