"use client"

import React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion } from "framer-motion"

interface SkillCategory {
  name: string
  color: string
  importance: number
  skills: string[]
}

interface TechnologiesSectionProps {
  skills: SkillCategory[]
}

const colorMap: Record<string, string> = {
  violet: "#8b5cf6",
  indigo: "#6366f1",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  orange: "#f97316",
  red: "#ef4444",
}

export function TechnologiesSection({ skills }: TechnologiesSectionProps) {
  const [selectedColor, setSelectedColor] = useState<string>("violet")
  const [paintedAreas, setPaintedAreas] = useState<Map<string, Set<string>>>(new Map())
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [revealedCategories, setRevealedCategories] = useState<Set<string>>(new Set())

  const colors = ["violet", "indigo", "blue", "green", "yellow", "orange", "red"]

  // Canvas drawing
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }, [selectedColor])

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    ctx.fillStyle = colorMap[selectedColor]
    ctx.globalAlpha = 0.6
    
    // Draw pixel blocks
    const blockSize = 20
    const blockX = Math.floor(x / blockSize) * blockSize
    const blockY = Math.floor(y / blockSize) * blockSize
    
    ctx.fillRect(blockX, blockY, blockSize, blockSize)
    
    // Track painted areas by color
    const areaKey = `${blockX}-${blockY}`
    setPaintedAreas(prev => {
      const newMap = new Map(prev)
      const colorAreas = newMap.get(selectedColor) || new Set()
      colorAreas.add(areaKey)
      newMap.set(selectedColor, colorAreas)
      return newMap
    })
    
    // Reveal category when enough area is painted
    const category = skills.find(s => s.color === selectedColor)
    if (category) {
      const colorAreas = paintedAreas.get(selectedColor)
      if (colorAreas && colorAreas.size > 10) {
        setRevealedCategories(prev => new Set([...prev, selectedColor]))
      }
    }
  }, [isDrawing, selectedColor, skills, paintedAreas])

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
  }, [])

  // Check reveal after paint areas update
  useEffect(() => {
    const colorAreas = paintedAreas.get(selectedColor)
    if (colorAreas && colorAreas.size > 10) {
      setRevealedCategories(prev => new Set([...prev, selectedColor]))
    }
  }, [paintedAreas, selectedColor])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#87ceeb] to-[#98fb98] p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-[var(--font-pixel)] text-xl md:text-2xl text-[#2a2520] text-center mb-8"
        >
        </motion.h2>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Garden scene with painter */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative flex-shrink-0"
          >
            {/* Painter character */}
            <svg
              width="150"
              height="200"
              viewBox="0 0 150 200"
              className="drop-shadow-lg"
              style={{ imageRendering: "pixelated" }}
            >
              {/* Beret */}
              <ellipse cx="75" cy="25" rx="30" ry="15" fill="#e63946" />
              <rect x="55" y="20" width="40" height="10" fill="#e63946" />
              
              {/* Head */}
              <rect x="55" y="30" width="40" height="35" fill="#e8d4b8" />
              
              {/* Eyes */}
              <motion.rect
                x="62" y="40" width="6" height="6" fill="#2a2520"
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
              />
              <motion.rect
                x="82" y="40" width="6" height="6" fill="#2a2520"
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
              />
              
              {/* Mustache */}
              <path d="M68 52 Q75 58 82 52" fill="#2a2520" />
              
              {/* Smock/shirt */}
              <rect x="45" y="65" width="60" height="80" fill="#f5f2e8" />
              
              {/* Paint splatters on smock */}
              <rect x="50" y="75" width="8" height="8" fill="#8b5cf6" opacity="0.7" />
              <rect x="85" y="90" width="6" height="6" fill="#22c55e" opacity="0.7" />
              <rect x="60" y="110" width="10" height="6" fill="#3b82f6" opacity="0.7" />
              <rect x="80" y="120" width="5" height="8" fill="#eab308" opacity="0.7" />
              
              {/* Arms */}
              <motion.g
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ transformOrigin: "45px 80px" }}
              >
                <rect x="25" y="70" width="25" height="15" fill="#f5f2e8" />
                <rect x="15" y="75" width="15" height="12" fill="#e8d4b8" />
                {/* Brush in hand */}
                <rect x="5" y="70" width="15" height="5" fill="#8b4513" />
                <rect x="0" y="68" width="8" height="8" fill={colorMap[selectedColor]} />
              </motion.g>
              
              <rect x="100" y="70" width="25" height="15" fill="#f5f2e8" />
              {/* Palette in other hand */}
              <ellipse cx="130" cy="90" rx="20" ry="12" fill="#8b4513" />
              {colors.map((color, i) => (
                <circle
                  key={color}
                  cx={120 + (i % 4) * 8}
                  cy={85 + Math.floor(i / 4) * 10}
                  r="4"
                  fill={colorMap[color]}
                />
              ))}
              
              {/* Legs */}
              <rect x="55" y="145" width="15" height="40" fill="#2a2520" />
              <rect x="80" y="145" width="15" height="40" fill="#2a2520" />
              
              {/* Feet */}
              <rect x="50" y="180" width="25" height="10" fill="#4a3728" />
              <rect x="75" y="180" width="25" height="10" fill="#4a3728" />
            </svg>
            
            <p className="text-center mt-4 font-[var(--font-pixel)] text-[8px] text-[#2a2520]/60">
            </p>
          </motion.div>
          
          {/* Painting area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex-1"
          >
            {/* Color palette */}
            <div className="flex justify-center gap-2 mb-4">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 border-4 transition-all pixel-cursor-pointer ${
                    selectedColor === color
                      ? "border-[#2a2520] scale-110"
                      : "border-[#2a2520]/30 hover:border-[#2a2520]/60"
                  }`}
                  style={{ backgroundColor: colorMap[color] }}
                  aria-label={`Select ${color} color`}
                />
              ))}
            </div>
            
            {/* Canvas for painting */}
            <div className="relative bg-[#f5f2e8] border-4 border-[#8b4513] shadow-[4px_4px_0px_0px_#4a3728]">
              <canvas
                ref={canvasRef}
                width={500}
                height={400}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-auto pixel-cursor-pointer"
                style={{ imageRendering: "pixelated" }}
              />
              
              {/* Easel frame hint */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-[#8b4513]" />
            </div>
          </motion.div>
          
          {/* Revealed skills */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="w-full lg:w-64 space-y-4"
          >
            <h3 className="font-[var(--font-pixel)] text-xs text-[#2a2520]/60">
              DISCOVERED SKILLS:
            </h3>
            
            {skills.map((category) => {
              const isRevealed = revealedCategories.has(category.color)
              const hasSkills = category.skills.length > 0
              
              return (
                <motion.div
                  key={category.color}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: isRevealed ? 1 : 0.3 }}
                  className={`p-3 border-2 transition-all ${
                    isRevealed
                      ? "border-[#2a2520]/40 bg-white/50"
                      : "border-dashed border-[#2a2520]/20"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-4 h-4 border border-[#2a2520]/30"
                      style={{ backgroundColor: colorMap[category.color] }}
                    />
                    <span className="font-[var(--font-pixel)] text-[8px] text-[#2a2520]">
                      {isRevealed ? category.name : "???"}
                    </span>
                  </div>
                  
                  {isRevealed && hasSkills && (
                    <div className="flex flex-wrap gap-1">
                      {category.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 text-xs font-[var(--font-pixel-body)] bg-[#2a2520]/10 text-[#2a2520]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {isRevealed && !hasSkills && (
                    <span className="text-xs font-[var(--font-pixel-body)] text-[#2a2520]/50 italic">
                      Coming soon...
                    </span>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        </div>
        
        {/* Garden decorations */}
        <div className="mt-8 flex justify-around">
          {/* Flowers */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            >
              <svg width="30" height="40" viewBox="0 0 30 40" style={{ imageRendering: "pixelated" }}>
                <rect x="13" y="20" width="4" height="20" fill="#228b22" />
                <circle cx="15" cy="15" r="8" fill={["#ff69b4", "#ffd700", "#ff6347", "#87ceeb", "#dda0dd"][i % 5]} />
                <circle cx="15" cy="15" r="3" fill="#ffd700" />
              </svg>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
