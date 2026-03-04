import React from "react"
import type { Metadata } from 'next'
import { Press_Start_2P, VT323 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { TabManager } from '@/components/tab-manager'
import './globals.css'

// Define the pixel-style font for headings
const pressStart = Press_Start_2P({ 
  weight: '400',
  subsets: ["latin"],
  variable: '--font-pixel'
});

// Define the pixel-style font for body text
const vt323 = VT323({ 
  weight: '400',
  subsets: ["latin"],
  variable: '--font-pixel-body'
});

// Define metadata for the website, including title, description, and icons
export const metadata: Metadata = {
  title: 'Shaurya Chopra',
  description: 'Portfolio of Shaurya Chopra - Exploring AI Engineering & Cyber Security. BTech CS + Cyber Security at Mumbai University.',
  generator: 'v0.app',
  keywords: ['Shaurya Chopra', 'AI Engineering', 'Cyber Security', 'Portfolio', 'Developer'],
  authors: [{ name: 'Shaurya Chopra' }],
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
}

/**
 * The root layout for the application.
 * This component wraps all pages and provides a consistent structure.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered inside the layout.
 * @returns {JSX.Element} The root layout component.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${pressStart.variable} ${vt323.variable} font-sans antialiased`}>
        <TabManager />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
