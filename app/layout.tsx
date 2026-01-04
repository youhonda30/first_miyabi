import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/providers/session-provider'
import { MainLayout } from '@/components/layout/main-layout'

export const metadata: Metadata = {
  title: 'FitGear - パーソナルトレーニングジムEC',
  description: 'パーソナルトレーニングコースとサプリメントを販売するECサイト',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <SessionProvider>
          <MainLayout>{children}</MainLayout>
        </SessionProvider>
      </body>
    </html>
  )
}
