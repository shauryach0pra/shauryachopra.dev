"use client"

import { motion } from "framer-motion"
import { Monitor } from "lucide-react"

interface MobileWarningProps {
  onContinue: () => void
}

export function MobileWarning({ onContinue }: MobileWarningProps) {
  return (
    <div className="fixed inset-0 bg-[#f5f2e8] z-[100] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md text-center space-y-6"
      >
        {/* Pixel art monitor icon */}
        <div className="flex justify-center">
          <svg
            width="120"
            height="100"
            viewBox="0 0 120 100"
            style={{ imageRendering: "pixelated" }}
          >
            {/* Monitor */}
            <rect x="10" y="5" width="100" height="65" fill="#2a2520" rx="2" />
            {/* Screen */}
            <rect x="15" y="10" width="90" height="55" fill="#1a365d" />
            {/* Screen glow */}
            <motion.rect
              x="20"
              y="15"
              width="80"
              height="45"
              fill="#22c55e"
              opacity="0.1"
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Text lines on screen */}
            <rect x="25" y="25" width="50" height="4" fill="#22c55e" opacity="0.6" />
            <rect x="25" y="35" width="40" height="4" fill="#22c55e" opacity="0.6" />
            <rect x="25" y="45" width="60" height="4" fill="#22c55e" opacity="0.6" />
            {/* Stand */}
            <rect x="50" y="70" width="20" height="10" fill="#2a2520" />
            <rect x="35" y="80" width="50" height="8" fill="#2a2520" />
          </svg>
        </div>

        <h1 className="font-[var(--font-pixel)] text-lg text-[#2a2520]">
          Best Viewed on Desktop
        </h1>

        <p className="font-[var(--font-pixel-body)] text-xl text-[#2a2520]/70 leading-relaxed">
          This portfolio features interactive pixel art animations and canvas-based navigation that work best on a larger screen.
        </p>

        <div className="space-y-3">
          <p className="font-[var(--font-pixel)] text-[10px] text-[#2a2520]/50">
            For the full experience, please visit on desktop
          </p>

          <button
            onClick={onContinue}
            className="w-full px-6 py-3 bg-[#2a2520] text-[#f5f2e8] font-[var(--font-pixel)] text-xs hover:bg-[#2a2520]/80 transition-colors pixel-cursor-pointer"
          >
            Continue Anyway
          </button>
        </div>

        {/* Quick info for mobile users */}
        <div className="pt-6 border-t border-[#2a2520]/20 space-y-4 text-left">
          <h2 className="font-[var(--font-pixel)] text-[10px] text-[#2a2520]/60">
            QUICK INFO:
          </h2>
          
          <div className="space-y-2 font-[var(--font-pixel-body)] text-lg text-[#2a2520]/80">
            <p><strong>Name:</strong> Shaurya Chopra</p>
            <p><strong>Focus:</strong> AI Engineering & Cyber Security</p>
            <p><strong>University:</strong> Mumbai University</p>
            <p><strong>Degree:</strong> BTech CS + Cyber Security</p>
          </div>

          <div className="flex gap-4 pt-2">
            <a
              href="https://www.linkedin.com/in/shaurya-chopra-1a1922379/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline text-[#2a2520] pixel-cursor-pointer"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/shauryach0pra"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline text-[#2a2520] pixel-cursor-pointer"
            >
              GitHub
            </a>
            <a
              href="mailto:shauryachopra@zohomail.in"
              className="text-sm underline text-[#2a2520] pixel-cursor-pointer"
            >
              Email
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
