"use client"

import { motion } from "framer-motion"

// Define the props for the PatrickBateman component
interface PatrickBatemanProps {
  isAnimating: boolean
}

/**
 * Renders a pixel-art character of Patrick Bateman.
 * The character animates out of view when the `isAnimating` prop is true.
 * @param {PatrickBatemanProps} props - The props for the component.
 * @returns {JSX.Element} The PatrickBateman component.
 */
export function PatrickBateman({ isAnimating }: PatrickBatemanProps) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      // Animate the character out of view
      animate={isAnimating ? { opacity: 0, y: -50 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      className="absolute"
      style={{ top: 90, left: 720, transform: "translateX(-50%)" }}
    >
      {/* SVG for the pixel-art character */}
      <svg
        width="120"
        height="180"
        viewBox="0 0 120 180"
        className="drop-shadow-lg"
        style={{ imageRendering: "pixelated" }}
      >
        {/* Hair */}
        <rect x="40" y="10" width="40" height="15" fill="#2a2520" />
        <rect x="35" y="20" width="50" height="10" fill="#2a2520" />
        
        {/* Face */}
        <rect x="40" y="25" width="40" height="35" fill="#e8d4b8" />
        
        {/* Eyes */}
        <rect x="48" y="35" width="6" height="6" fill="#2a2520" />
        <rect x="66" y="35" width="6" height="6" fill="#2a2520" />
        
        {/* Eyebrows */}
        <rect x="46" y="32" width="10" height="2" fill="#2a2520" />
        <rect x="64" y="32" width="10" height="2" fill="#2a2520" />
        
        {/* Nose */}
        <rect x="57" y="42" width="6" height="8" fill="#d4c0a8" />
        
        {/* Mouth */}
        <rect x="52" y="52" width="16" height="3" fill="#c4a488" />
        
        {/* Neck */}
        <rect x="52" y="60" width="16" height="10" fill="#e8d4b8" />
        
        {/* Suit */}
        <rect x="30" y="70" width="60" height="70" fill="#2a2520" />
        
        {/* Shirt */}
        <rect x="50" y="70" width="20" height="15" fill="#f5f2e8" />
        <polygon points="50,70 60,85 50,85" fill="#f5f2e8" />
        <polygon points="70,70 60,85 70,85" fill="#f5f2e8" />
        
        {/* Red tie (behind suit lapels, in front of shirt) */}
        <rect x="57" y="80" width="6" height="30" fill="#8b0000" />
        
        {/* Suit lapels */}
        <polygon points="30,70 50,70 50,100 30,90" fill="#1a1815" />
        <polygon points="90,70 70,70 70,100 90,90" fill="#1a1815" />
        
        {/* Arms and hands */}
        <rect x="20" y="75" width="15" height="50" fill="#2a2520" />
        <rect x="85" y="75" width="15" height="50" fill="#2a2520" />
        <rect x="20" y="120" width="15" height="15" fill="#e8d4b8" />
        <rect x="85" y="120" width="15" height="15" fill="#e8d4b8" />
        
        {/* The business card, animated to drop out of view */}
        <motion.g
          initial={{ y: 0, rotate: 0, opacity: 1 }}
          animate={isAnimating ? { y: 200, rotate: 15, opacity: 0 } : { y: 0 }}
          transition={{ duration: 0.8, ease: "easeIn" }}
        >
          <rect x="22" y="130" width="30" height="18" fill="#f5f2e8" stroke="#2a2520" strokeWidth="1" />
        </motion.g>
      </svg>
    </motion.div>
  )
}
