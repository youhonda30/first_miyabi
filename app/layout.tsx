import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'パーソナルトレーニングジムEC',
  description: 'パーソナルトレーニングコースとサプリメントを販売するECサイト',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
