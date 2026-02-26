"use client"

import { motion } from "framer-motion"

interface BusinessCardProps {
  onAnimationComplete?: () => void
}

export function BusinessCard({ onAnimationComplete }: BusinessCardProps) {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0, rotate: -10 }}
      animate={{ y: 0, opacity: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.5,
      }}
      onAnimationComplete={onAnimationComplete}
      className="relative w-[500px] max-w-[90vw] aspect-[1.75/1] bg-[#f5f2e8] border-2 border-[#2a2520]/20 shadow-[8px_8px_0px_0px_rgba(42,37,32,0.2)]"
      style={{
        imageRendering: "pixelated",
      }}
    >
      {/* Card texture overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' fill='%23d4d0c4' x='0' y='0'/%3E%3Crect width='1' height='1' fill='%23d4d0c4' x='2' y='2'/%3E%3C/svg%3E")`,
          backgroundSize: "4px 4px",
        }}
      />
      
      {/* Card content */}
      <div className="relative h-full p-6 flex flex-col justify-between font-[var(--font-pixel-body)]">
        {/* Top row */}
        <div className="flex justify-between items-start">
          {/* Left - Contact */}
          <div className="text-[#2a2520]/80 text-xs md:text-sm space-y-1 tracking-wide">
            <p>shauryachopra@zohomail.in</p>
            <p>+91 9137887901</p>
          </div>
          
          {/* Right - University */}
          <div className="text-[#2a2520]/80 text-xs md:text-sm text-right tracking-wide">
            <p>Mumbai University</p>
          </div>
        </div>
        
        {/* Center - Name and Tagline */}
        <div className="text-center space-y-2">
          <h1 
            className="text-[#2a2520] text-xl md:text-2xl tracking-[0.2em] font-[var(--font-pixel)]"
            style={{ fontWeight: 400 }}
          >
            Shaurya Chopra
          </h1>
          <p className="text-[#2a2520]/70 text-xs md:text-sm tracking-wider italic">
            Exploring AI Engineering &
          </p>
          <p className="text-[#2a2520]/70 text-xs md:text-sm tracking-wider italic">
            Cyber Security
          </p>
        </div>
        
        {/* Bottom - Links */}
        <div className="flex justify-center gap-8 text-xs md:text-sm">
          <a 
            href="https://www.linkedin.com/in/shaurya-chopra-1a1922379/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2a2520]/80 hover:text-[#2a2520] transition-colors underline underline-offset-2 pixel-cursor-pointer"
          >
            LinkedIn
          </a>
          <a 
            href="https://github.com/shauryach0pra"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2a2520]/80 hover:text-[#2a2520] transition-colors underline underline-offset-2 pixel-cursor-pointer"
          >
            GitHub
          </a>
        </div>
      </div>
      
      {/* Embossed effect border */}
      <div className="absolute inset-0 border border-[#fff]/30 pointer-events-none" />
    </motion.div>
  )
}
