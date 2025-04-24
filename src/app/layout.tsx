import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mars Event Registration',
  description: 'Register for the Mars Colony Launch Party',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
