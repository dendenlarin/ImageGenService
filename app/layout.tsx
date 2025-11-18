import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ImageGen Service',
  description: 'AI-powered image generation service',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
