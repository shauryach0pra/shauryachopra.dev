"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Define the structure for a project
interface Project {
  id: number
  name: string
  description: string
  techStack: string[]
  screenshots: string[]
  github: string
  liveDemo: string
}

// Define the props for the CoffeeMug component
interface CoffeeMugProps {
  projects: Project[]
  onProjectSelect: (project: Project) => void
}

/**
 * Renders an interactive pixel-art coffee mug.
 * When clicked, the mug spills and reveals projects as sugar cubes.
 * @param {CoffeeMugProps} props - The props for the component.
 * @returns {JSX.Element} The CoffeeMug component.
 */
export function CoffeeMug({ projects, onProjectSelect }: CoffeeMugProps) {
  // State to track if the coffee has been spilled
  const [isSpilled, setIsSpilled] = useState(false)
  // State to control the visibility of the sugar cubes (projects)
  const [showSugarCubes, setShowSugarCubes] = useState(false)

  // Handle the click event on the mug
  const handleClick = () => {
    if (!isSpilled) {
      setIsSpilled(true)
      // Show the sugar cubes after a delay to sync with the spill animation
      setTimeout(() => setShowSugarCubes(true), 800)
    }
  }

  return (
    <div className="relative">
      {/* The coffee mug itself */}
      <motion.div
        className="relative cursor-pointer pixel-cursor-pointer"
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        animate={isSpilled ? { rotate: -45 } : { rotate: 0 }} // Animate rotation on spill
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* SVG for the pixel-art mug */}
        <svg width="80" height="100" viewBox="0 0 80 100" className="drop-shadow-lg">
          <rect x="10" y="20" width="50" height="60" fill="#f5f2e8" stroke="#2a2520" strokeWidth="3"/>
          <path d="M60 30 L70 30 L70 70 L60 70" fill="none" stroke="#2a2520" strokeWidth="3"/>
          {/* Coffee liquid inside the mug */}
          {!isSpilled && (
            <rect x="13" y="25" width="44" height="30" fill="#4a3728"/>
          )}
          {/* Animated steam */}
          {!isSpilled && (
            <>
              <motion.path
                d="M25 15 Q30 5 25 0"
                fill="none"
                stroke="#2a2520"
                strokeWidth="2"
                opacity="0.3"
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.path
                d="M40 15 Q45 5 40 0"
                fill="none"
                stroke="#2a2520"
                strokeWidth="2"
                opacity="0.3"
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}
        </svg>

        {/* Hover hint */}
        {!isSpilled && (
          <motion.p
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap font-[var(--font-pixel)] text-[8px]"
          >
            Click me!
          </motion.p>
        )}
      </motion.div>

      {/* The spilled coffee puddle */}
      <AnimatePresence>
        {isSpilled && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-[60px] left-[-20px] w-[150px] h-[100px]"
          >
            <svg viewBox="0 0 150 100" className="w-full h-full">
              <motion.ellipse
                cx="75"
                cy="50"
                rx="60"
                ry="30"
                fill="#4a3728"
                opacity="0.6"
                initial={{ rx: 0, ry: 0 }}
                animate={{ rx: 60, ry: 30 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The sugar cubes, representing projects */}
      <AnimatePresence>
        {showSugarCubes && (
          <div className="absolute top-[80px] left-[-40px] flex flex-wrap gap-4 w-[200px]">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ y: -50, opacity: 0, scale: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1, 
                  scale: 1,
                  rotate: Math.random() * 20 - 10
                }}
                transition={{ 
                  delay: index * 0.2 + 0.3,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                whileHover={{ scale: 1.1, rotate: 0, zIndex: 10 }}
                onClick={() => onProjectSelect(project)}
                className="relative cursor-pointer pixel-cursor-pointer"
              >
                {/* The sugar cube itself */}
                <div className="w-16 h-16 bg-[#f5f2e8] border-2 border-[#2a2520]/30 shadow-[2px_2px_0px_0px_rgba(42,37,32,0.2)] flex items-center justify-center p-1">
                  <span className="text-[6px] font-[var(--font-pixel)] text-[#2a2520] text-center leading-tight break-words">
                    {project.name}
                  </span>
                </div>
                
                {/* Subtle texture for the sugar cube */}
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='2' height='2' viewBox='0 0 2 2' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' fill='%23d4d0c4' x='0' y='0'/%3E%3C/svg%3E")`,
                    backgroundSize: "2px 2px",
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
