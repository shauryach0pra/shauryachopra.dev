"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight } from "lucide-react"

// Define the structure of the data for the About section
interface AboutData {
  personal: {
    name: string
    email: string
    phone: string
    linkedin: string
    github: string
    university: string
    degree: string
    tagline: string
  }
  background: {
    education: string[]
    childhood: string
    current: string
  }
  interests: string[]
  goals: {
    career: string
    passion: string
    learning: string
  }
}

// Define the props for the AboutSection component
interface AboutSectionProps {
  aboutData: AboutData
}

/**
 * Renders the About section of the portfolio.
 * This component displays a pixel-art room with a clickable computer that opens a pop-up with more information.
 * @param {AboutSectionProps} props - The props for the component.
 * @returns {JSX.Element} The AboutSection component.
 */
export function AboutSection({ aboutData }: AboutSectionProps) {
  // State to manage the visibility of the browser pop-up
  const [showBrowser, setShowBrowser] = useState(false)
  // State to manage the active tab in the browser pop-up
  const [activeTab, setActiveTab] = useState<"background" | "interests" | "goals">("background")

  // Define the tabs for the browser pop-up
  const tabs = [
    { id: "background" as const, label: "Background" },
    { id: "interests" as const, label: "Interests" },
    { id: "goals" as const, label: "Goals" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5e6d3] to-[#e8d4b8] p-8 pt-24 relative overflow-hidden">
      {/* Room background with wall and floor */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Wall with picture frame and clock */}
        <div className="absolute top-0 left-0 right-0 h-[60%] bg-[#f5e6d3]">
          {/* Picture frame */}
          <div className="absolute w-32 h-24 border-4 border-[#8b4513] bg-[#87ceeb]" style={{ top: 80, left: 144 }}>
            <div className="absolute inset-2 bg-gradient-to-b from-[#87ceeb] to-[#98fb98]" />
          </div>
          
          {/* Animated clock */}
          <motion.div
            className="absolute w-16 h-16 rounded-full border-4 border-[#8b4513] bg-[#f5f2e8]"
            style={{ top: 64, right: 216 }}
          >
            <motion.div
              className="absolute top-1/2 left-1/2 w-1 h-5 bg-[#2a2520] origin-bottom"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              style={{ transform: "translate(-50%, -100%)" }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 w-1 h-3 bg-[#2a2520] origin-bottom"
              animate={{ rotate: 360 }}
              transition={{ duration: 3600, repeat: Infinity, ease: "linear" }}
              style={{ transform: "translate(-50%, -100%)" }}
            />
          </motion.div>
        </div>
        
        {/* Floor with wood texture */}
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-[#8b4513]">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 50px, #6b3510 50px, #6b3510 100px)`,
            }}
          />
        </div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-[var(--font-pixel)] text-xl md:text-2xl text-[#2a2520] text-center mb-12"
        >
        </motion.h2>
        
        {/* Desk with computer and other items */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          {/* Desk structure */}
          <div className="relative mx-auto w-full max-w-2xl">
            {/* Desk top */}
            <div className="h-8 bg-[#8b4513] border-2 border-[#6b3510] rounded-t-lg" />
            
            {/* Items on the desk */}
            <div className="relative bg-[#a0522d] border-x-2 border-b-2 border-[#6b3510] p-8 flex justify-center items-end gap-8">
              
              {/* Animated lamp */}
              <div className="absolute left-8 bottom-6">
                <motion.div
                  animate={{ 
                    boxShadow: ["0 0 20px 10px rgba(255,215,0,0.3)", "0 0 30px 15px rgba(255,215,0,0.4)", "0 0 20px 10px rgba(255,215,0,0.3)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative"
                >
                  <svg width="50" height="80" viewBox="0 0 50 80" style={{ imageRendering: "pixelated" }}>
                    <polygon points="10,0 40,0 45,30 5,30" fill="#ffd700" />
                    <ellipse cx="25" cy="30" rx="15" ry="5" fill="#fff8dc" opacity="0.5" />
                    <rect x="22" y="30" width="6" height="35" fill="#2a2520" />
                    <ellipse cx="25" cy="70" rx="15" ry="5" fill="#2a2520" />
                  </svg>
                </motion.div>
              </div>
              
              {/* Clickable computer monitor */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setShowBrowser(true)}
                className="cursor-pointer pixel-cursor-pointer relative"
              >
                <svg width="200" height="160" viewBox="0 0 200 160" style={{ imageRendering: "pixelated" }}>
                  <rect x="10" y="0" width="180" height="120" fill="#2a2520" rx="4" />
                  <rect x="15" y="5" width="170" height="105" fill="#1a365d" />
                  <text x="25" y="30" fill="#22c55e" fontSize="10" fontFamily="monospace">{">"} Hello, I'm Shaurya</text>
                  <text x="25" y="50" fill="#22c55e" fontSize="10" fontFamily="monospace">{">"} Click to learn more</text>
                  <motion.rect
                    x="25"
                    y="60"
                    width="8"
                    height="12"
                    fill="#22c55e"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <rect x="85" y="120" width="30" height="15" fill="#2a2520" />
                  <rect x="70" y="135" width="60" height="10" fill="#2a2520" />
                </svg>
                
                {/* Hover hint for the monitor */}
                <motion.p
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-[var(--font-pixel)] text-[#2a2520] whitespace-nowrap"
                >
                  Click the screen!
                </motion.p>
              </motion.div>
              
              {/* Animated plant */}
              <div className="absolute right-8 bottom-6">
                <svg width="50" height="70" viewBox="0 0 50 70" style={{ imageRendering: "pixelated" }}>
                  <polygon points="10,40 40,40 35,70 15,70" fill="#d2691e" />
                  <rect x="8" y="35" width="34" height="8" fill="#d2691e" />
                  <motion.g
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ transformOrigin: "25px 40px" }}
                  >
                    <ellipse cx="15" cy="20" rx="8" ry="15" fill="#228b22" transform="rotate(-20 15 20)" />
                    <ellipse cx="25" cy="15" rx="6" ry="18" fill="#2e8b2e" />
                    <ellipse cx="35" cy="20" rx="8" ry="15" fill="#228b22" transform="rotate(20 35 20)" />
                  </motion.g>
                </svg>
              </div>
              
              {/* Stack of books */}
              <div className="absolute right-24 bottom-6">
                <svg width="40" height="50" viewBox="0 0 40 50" style={{ imageRendering: "pixelated" }}>
                  <rect x="0" y="0" width="12" height="50" fill="#e63946" />
                  <rect x="14" y="5" width="10" height="45" fill="#457b9d" />
                  <rect x="26" y="10" width="14" height="40" fill="#2a9d8f" />
                </svg>
              </div>
            </div>
            
            {/* Desk legs */}
            <div className="flex justify-between px-4">
              <div className="w-6 h-24 bg-[#6b3510]" />
              <div className="w-6 h-24 bg-[#6b3510]" />
            </div>
          </div>
          
          {/* Chair */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <svg width="100" height="80" viewBox="0 0 100 80" style={{ imageRendering: "pixelated" }}>
              <rect x="15" y="30" width="70" height="15" fill="#2a2520" rx="2" />
              <rect x="20" y="0" width="60" height="35" fill="#2a2520" rx="2" />
              <rect x="5" y="25" width="15" height="8" fill="#2a2520" />
              <rect x="80" y="25" width="15" height="8" fill="#2a2520" />
              <rect x="40" y="45" width="20" height="20" fill="#1a1a1a" />
              <circle cx="30" cy="75" r="5" fill="#1a1a1a" />
              <circle cx="50" cy="75" r="5" fill="#1a1a1a" />
              <circle cx="70" cy="75" r="5" fill="#1a1a1a" />
            </svg>
          </div>
        </motion.div>
      </div>
      
      {/* Browser pop-up that appears on computer click */}
      <AnimatePresence>
        {showBrowser && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBrowser(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            
            {/* Browser window */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-[700px] max-h-[80vh]"
            >
              <div className="bg-[#f5f2e8] border-4 border-[#2a2520] shadow-[8px_8px_0px_0px_#2a2520] overflow-hidden">
                {/* Browser top bar with traffic lights and URL */}
                <div className="bg-[#2a2520] text-[#f5f2e8] px-4 py-2">
                  {/* Traffic light buttons */}
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => setShowBrowser(false)}
                      className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 pixel-cursor-pointer"
                    />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  
                  {/* URL bar */}
                  <div className="flex items-center gap-2 bg-[#f5f2e8] text-[#2a2520] px-3 py-1 rounded text-sm font-[var(--font-pixel-body)]">
                    <span className="text-[#2a2520]/50">about://</span>
                    <span>shauryachopra.dev</span>
                  </div>
                </div>
                
                {/* Browser tabs */}
                <div className="flex border-b-2 border-[#2a2520]/20 bg-[#e8e0d0]">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 font-[var(--font-pixel)] text-[10px] transition-colors pixel-cursor-pointer ${
                        activeTab === tab.id
                          ? "bg-[#f5f2e8] text-[#2a2520] border-t-2 border-x-2 border-[#2a2520]/20 -mb-[2px]"
                          : "text-[#2a2520]/60 hover:text-[#2a2520]/80"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                {/* Content of the active tab */}
                <div className="p-6 max-h-[50vh] overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {/* Background tab content */}
                    {activeTab === "background" && (
                      <motion.div
                        key="background"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <h3 className="font-[var(--font-pixel)] text-sm text-[#2a2520] mb-4">
                          Education Journey
                        </h3>
                        <ul className="space-y-2">
                          {aboutData.background.education.map((edu, i) => (
                            <li key={i} className="flex items-start gap-2 font-[var(--font-pixel-body)] text-lg text-[#2a2520]/80">
                              <ChevronRight size={16} className="mt-1 flex-shrink-0" />
                              {edu}
                            </li>
                          ))}
                        </ul>
                        
                        <div className="border-t border-[#2a2520]/20 pt-4 mt-4">
                          <h3 className="font-[var(--font-pixel)] text-sm text-[#2a2520] mb-2">
                            Fun Fact
                          </h3>
                          <p className="font-[var(--font-pixel-body)] text-lg text-[#2a2520]/80">
                            {aboutData.background.childhood}
                          </p>
                        </div>
                        
                        <div className="border-t border-[#2a2520]/20 pt-4 mt-4">
                          <h3 className="font-[var(--font-pixel)] text-sm text-[#2a2520] mb-2">
                            Currently
                          </h3>
                          <p className="font-[var(--font-pixel-body)] text-lg text-[#2a2520]/80">
                            {aboutData.background.current}
                          </p>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Interests tab content */}
                    {activeTab === "interests" && (
                      <motion.div
                        key="interests"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <h3 className="font-[var(--font-pixel)] text-sm text-[#2a2520] mb-4">
                          What I Enjoy
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {aboutData.interests.map((interest, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="p-4 bg-[#2a2520]/5 border-2 border-[#2a2520]/10 text-center"
                            >
                              <span className="font-[var(--font-pixel-body)] text-lg text-[#2a2520]">
                                {interest}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Goals tab content */}
                    {activeTab === "goals" && (
                      <motion.div
                        key="goals"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <h3 className="font-[var(--font-pixel)] text-sm text-[#2a2520] mb-4">
                          Career Goals
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="p-4 bg-[#8b5cf6]/10 border-l-4 border-[#8b5cf6]">
                            <h4 className="font-[var(--font-pixel)] text-[10px] text-[#8b5cf6] mb-1">
                              ASPIRATION
                            </h4>
                            <p className="font-[var(--font-pixel-body)] text-lg text-[#2a2520]">
                              {aboutData.goals.career}
                            </p>
                          </div>
                          
                          <div className="p-4 bg-[#22c55e]/10 border-l-4 border-[#22c55e]">
                            <h4 className="font-[var(--font-pixel)] text-[10px] text-[#22c55e] mb-1">
                              PASSION
                            </h4>
                            <p className="font-[var(--font-pixel-body)] text-lg text-[#2a2520]">
                              {aboutData.goals.passion}
                            </p>
                          </div>
                          
                          <div className="p-4 bg-[#3b82f6]/10 border-l-4 border-[#3b82f6]">
                            <h4 className="font-[var(--font-pixel)] text-[10px] text-[#3b82f6] mb-1">
                              MINDSET
                            </h4>
                            <p className="font-[var(--font-pixel-body)] text-lg text-[#2a2520]">
                              {aboutData.goals.learning}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
