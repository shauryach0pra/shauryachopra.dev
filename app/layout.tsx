import React from "react"
import type { Metadata } from 'next'
import { Press_Start_2P, VT323 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const pressStart = Press_Start_2P({ 
  weight: '400',
  subsets: ["latin"],
  variable: '--font-pixel'
});

const vt323 = VT323({ 
  weight: '400',
  subsets: ["latin"],
  variable: '--font-pixel-body'
});

export const metadata: Metadata = {
  title: 'Shaurya Chopra | AI Engineering & Cyber Security',
  description: 'Portfolio of Shaurya Chopra - Exploring AI Engineering & Cyber Security. BTech CS + Cyber Security at Mumbai University.',
  generator: 'v0.app',
  keywords: ['Shaurya Chopra', 'AI Engineering', 'Cyber Security', 'Portfolio', 'Developer'],
  authors: [{ name: 'Shaurya Chopra' }],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${pressStart.variable} ${vt323.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
