"use client"

import { motion } from "framer-motion"
import { Volume2, VolumeX } from "lucide-react"

// Define the available sections for navigation
type Section = "card" | "technologies" | "about"

// Define the props for the Navigation component
interface NavigationProps {
  currentSection: Section
  onNavigate: (section: Section) => void
  showHomeButton: boolean
  isMuted: boolean
  onToggleMute: () => void
}

/**
 * Renders the main navigation bar for the portfolio.
 * Includes links to different sections and a sound toggle button.
 * @param {NavigationProps} props - The props for the component.
 * @returns {JSX.Element} The Navigation component.
 */
export function Navigation({
  currentSection,
  onNavigate,
  showHomeButton,
  isMuted,
  onToggleMute,
}: NavigationProps) {
  // Conditionally define navigation items based on whether the home button should be shown
  const navItems: { id: Section; label: string }[] = showHomeButton
    ? [
        { id: "card", label: "Card (Home)" },
        { id: "technologies", label: "Technologies" },
        { id: "about", label: "About Me" },
      ]
    : [
        { id: "technologies", label: "Technologies" },
        { id: "about", label: "About Me" },
      ]

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-40 bg-[#f5f2e8]/90 backdrop-blur-sm border-b-2 border-[#2a2520]/20"
    >
      <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Navigation links */}
        <ul className="flex items-center gap-6">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`font-[var(--font-pixel)] text-[10px] md:text-xs transition-colors pixel-cursor-pointer ${
                  currentSection === item.id
                    ? "text-[#2a2520]"
                    : "text-[#2a2520]/50 hover:text-[#2a2520]/80"
                }`}
              >
                {/* Add a '>' indicator for the current section */}
                {currentSection === item.id && (
                  <span className="mr-1">{">"}</span>
                )}
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Sound toggle button */}
        <button
          onClick={onToggleMute}
          className="p-2 bg-[#f5f5f5] border-2 border-[#cccccc] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white hover:border-[#000000] transition-all pixel-cursor-pointer rounded"
          style={{
            boxShadow: "3px 3px 0 #999999, 3px 3px 6px rgba(0,0,0,0.2), inset -2px -2px 0 #cccccc, inset 2px 2px 0 #ffffff"
          }}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </nav>
    </motion.header>
  )
}
