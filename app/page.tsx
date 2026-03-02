"use client"

import React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2, VolumeX, Home, Briefcase, User, Palette, Monitor, Github, Linkedin, Mail, Phone, X } from "lucide-react"

// Import data
import { skillsData } from "@/data/skills"
import { projectsData } from "@/data/projects"
import { aboutData } from "@/data/about"

type Section = "card" | "projects" | "technologies" | "about"

interface Project {
  id: number
  name: string
  description: string
  techStack: string[]
  screenshots: string[]
  github: string
  liveDemo: string
}

// Responsive wrapper - scales everything uniformly to fit viewport
function ResponsiveWrapper({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState(1)
  const [vOffset, setVOffset] = useState(0)
  const BASE_WIDTH = 1440
  const BASE_HEIGHT = 900
  const MIN_SCALE = 0.5

  useEffect(() => {
    const updateScale = () => {
      // Use clientHeight/Width for more stable measurements on Safari
      const width = document.documentElement.clientWidth
      const height = document.documentElement.clientHeight
      const scaleX = width / BASE_WIDTH
      const scaleY = height / BASE_HEIGHT
      
      // Use Math.max instead of Math.min to ensure the content always covers the screen
      // This eliminates black bars by allowing slight clipping on the edges
      const newScale = Math.max(MIN_SCALE, Math.max(scaleX, scaleY))
      setScale(newScale)

      // Calculate if we need to shift the content to protect the top UI
      // If the scaled container's top would be off-screen, we shift it down
      const containerHeightOnScreen = BASE_HEIGHT * newScale
      if (containerHeightOnScreen > height) {
        // Shift it down so the top of the container is at the top of the viewport
        // The centering flexbox would normally place it at (height - containerHeightOnScreen) / 2
        // We want its top at 0, so we offset by the absolute value of that negative position
        const defaultTop = (height - containerHeightOnScreen) / 2
        setVOffset(-defaultTop / newScale) // Divide by scale because it's applied inside the transform
      } else {
        setVOffset(0)
      }
    }

    updateScale()
    window.addEventListener("resize", updateScale)
    // Also listen for orientationchange for mobile Safari
    window.addEventListener("orientationchange", updateScale)
    return () => {
      window.removeEventListener("resize", updateScale)
      window.removeEventListener("orientationchange", updateScale)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-[#2a2520] overflow-hidden flex items-center justify-center">
      <div
        style={{
          width: `${BASE_WIDTH}px`,
          height: `${BASE_HEIGHT}px`,
          transform: `scale(${scale}) translateY(${vOffset}px)`,
          transformOrigin: "center center",
          flexShrink: 0,
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Sound hook
function useSounds(isMuted: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null)

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = "square") => {
    if (isMuted) return
    try {
      const ctx = getAudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.value = frequency
      gain.gain.value = 0.1
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
    } catch {
      // Audio not supported
    }
  }, [isMuted, getAudioContext])

  const playClick = useCallback(() => playTone(800, 0.05), [playTone])
  
  const playCardFlick = useCallback(() => {
    if (isMuted) return
    try {
      const ctx = getAudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(800, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15)
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.15)
    } catch {}
  }, [isMuted, getAudioContext])

  const playCardLand = useCallback(() => {
    if (isMuted) return
    try {
      const ctx = getAudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(100, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1)
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.1)
    } catch {}
  }, [isMuted, getAudioContext])

  const playSpill = useCallback(() => {
    if (isMuted) return
    try {
      const ctx = getAudioContext()
      const noise = ctx.createOscillator()
      const gain = ctx.createGain()
      noise.type = "sawtooth"
      noise.frequency.setValueAtTime(200, ctx.currentTime)
      noise.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.5)
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
      noise.connect(gain)
      gain.connect(ctx.destination)
      noise.start()
      noise.stop(ctx.currentTime + 0.5)
    } catch {}
  }, [isMuted, getAudioContext])

  return { playClick, playCardFlick, playCardLand, playSpill }
}

// Ambient music hook
function useAmbientMusic(isPlaying: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])

  useEffect(() => {
    if (isPlaying) {
      try {
        const ctx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
        audioContextRef.current = ctx
        const masterGain = ctx.createGain()
        masterGain.gain.value = 0.03
        masterGain.connect(ctx.destination)

        const notes = [65.41, 82.41, 98.00, 130.81]
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator()
          const oscGain = ctx.createGain()
          osc.type = "sine"
          osc.frequency.value = freq
          oscGain.gain.value = 0.3 / (i + 1)
          osc.connect(oscGain)
          oscGain.connect(masterGain)
          osc.start()
          oscillatorsRef.current.push(osc)
        })
      } catch {}
    } else {
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop() } catch {}
      })
      oscillatorsRef.current = []
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }

    return () => {
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop() } catch {}
      })
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [isPlaying])
}

// 8-BIT PIXEL BUTTON COMPONENT
function PixelButton({ 
  children, 
  onClick, 
  isActive = false,
  className = ""
}: { 
  children: React.ReactNode
  onClick?: () => void
  isActive?: boolean
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`relative font-[var(--font-pixel)] text-xs tracking-wider transition-all ${className}`}
      style={{
        padding: "8px 16px",
        imageRendering: "pixelated",
        backgroundColor: isActive ? "#000000" : "#ffffff",
        color: isActive ? "#ffffff" : "#000000",
        border: "3px solid #000000",
        transform: isActive ? "translate(1px, 1px)" : "none",
      }}
    >
      {children}
    </button>
  )
}

export default function Portfolio() {
  const [currentSection, setCurrentSection] = useState<Section>("card")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [animationPhase, setAnimationPhase] = useState<"intro" | "walking" | "throwing" | "spinning" | "landed" | "zooming" | "ready">("intro")
  const [isMuted, setIsMuted] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false)
  
  console.log("[v0] Portfolio rendering, animationPhase:", animationPhase, "isMobile:", isMobile, "currentSection:", currentSection)
  
  const { playClick, playCardFlick, playCardLand, playSpill } = useSounds(isMuted)
  
  useAmbientMusic(!isMuted)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Intro animation sequence - only plays once
  useEffect(() => {
    if (hasPlayedIntro) {
      setAnimationPhase("ready")
      return
    }
    
    // Patrick walks from left to center
    const t1 = setTimeout(() => setAnimationPhase("walking"), 200)
    // Patrick stops and throws the card
    const t2 = setTimeout(() => {
      setAnimationPhase("throwing")
      playCardFlick()
    }, 1600)
    // Card starts spinning through the air
    const t3 = setTimeout(() => setAnimationPhase("spinning"), 1900)
    // Card lands on the table
    const t4 = setTimeout(() => {
      setAnimationPhase("landed")
      playCardLand()
    }, 2900)
    // Start zooming in - Patrick exits during this phase
    const t5 = setTimeout(() => setAnimationPhase("zooming"), 3400)
    // Animation complete
    const t6 = setTimeout(() => {
      setAnimationPhase("ready")
      setHasPlayedIntro(true)
    }, 5200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); clearTimeout(t6) }
  }, [playCardFlick, playCardLand, hasPlayedIntro])

  const handleNavigate = useCallback((section: Section) => {
    playClick()
    setCurrentSection(section)
  }, [playClick])

  if (isMobile) {
    return (
      <div className="min-h-screen bg-wall-dark flex items-center justify-center p-8">
      
        <div className="bg-primary border-4 border-primary/70 p-8 text-center max-w-sm" style={{ imageRendering: "pixelated" }}>
          <Monitor className="w-16 h-16 mx-auto text-destructive mb-4" />
          <h1 className="font-mono text-lg text-primary-foreground mb-4">Desktop Required</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            This interactive portfolio is best viewed on a larger screen.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveWrapper>
      <main className="w-full h-full overflow-hidden relative">
      
      {/* 8-BIT PIXEL NAVIGATION */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: animationPhase === "ready" ? 0 : 5.5, duration: 0.5 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2"
        style={{ imageRendering: "pixelated" }}
      >
        {[
  { id: "card" as Section, icon: Home, label: "HOME" },
  { id: "technologies" as Section, icon: Palette, label: "SKILLS" },
  { id: "projects" as Section, icon: Briefcase, label: "PROJECTS" },
  { id: "about" as Section, icon: User, label: "ABOUT" },
].map((item) => (
          <PixelButton
            key={item.id}
            onClick={() => handleNavigate(item.id)}
            isActive={currentSection === item.id}
          >
            <span className="flex items-center gap-2">
              <item.icon size={12} strokeWidth={2.5} />
              {item.label}
            </span>
          </PixelButton>
        ))}
        
        <PixelButton
          onClick={() => { setIsMuted(!isMuted); playClick() }}
          isActive={!isMuted}
        >
          {isMuted ? <VolumeX size={14} strokeWidth={2.5} /> : <Volume2 size={14} strokeWidth={2.5} />}
        </PixelButton>
      </motion.nav>

      <AnimatePresence mode="wait">
        {currentSection === "card" && (
          <CardScene key="card" animationPhase={animationPhase} hasPlayedIntro={hasPlayedIntro} playClick={playClick} />
        )}
        {currentSection === "projects" && (
          <ProjectsScene 
            key="projects" 
            projects={projectsData}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
            onCloseProject={() => setSelectedProject(null)}
            playClick={playClick}
          />
        )}
        {currentSection === "technologies" && (
          <TechnologiesScene key="technologies" skills={skillsData} playClick={playClick} />
        )}
        {currentSection === "about" && (
          <AboutScene key="about" aboutData={aboutData} playClick={playClick} />
        )}
      </AnimatePresence>
      </main>
    </ResponsiveWrapper>
  )
}

// ============ CARD SCENE - Patrick Bateman's Office ============
function CardScene({ animationPhase, hasPlayedIntro, playClick }: { animationPhase: string, hasPlayedIntro: boolean, playClick: () => void }) {
  const isZoomed = animationPhase === "zooming" || animationPhase === "ready"
  const showCharacter = !hasPlayedIntro && ["intro", "walking", "throwing", "spinning", "landed", "zooming"].includes(animationPhase)
  
  // Base dimensions for positioning (1440x900)
  const BASE_W = 1440
  const BASE_H = 900
  const CENTER_X = BASE_W / 2  // 720
  const CENTER_Y = BASE_H / 2  // 450
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full relative overflow-hidden"
      style={{ width: `${BASE_W}px`, height: `${BASE_H}px` }}
    >
      {/* Scene container - starts closer, zooms to card */}
      <motion.div
        animate={isZoomed ? { scale: 2.2, y: -18 } : { scale: 1.6, y: 0 }}
        transition={{ duration: hasPlayedIntro ? 0 : 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute inset-0 origin-center"
        style={{ imageRendering: "pixelated" }}
      >
        {/* Dark office wall */}
        <div className="absolute left-0 right-0 bg-wall" style={{ top: 0, height: 378 }}>
          {/* Wall paneling */}
          <svg className="absolute inset-0 w-full h-full opacity-12">
            <defs>
              <pattern id="wallPanel" patternUnits="userSpaceOnUse" width="100" height="180">
                <rect width="96" height="176" fill="none" stroke="#3a3530" strokeWidth="2" x="2" y="2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wallPanel)" />
          </svg>
          
          {/* Painting on left */}
          <div className="absolute" style={{ top: 68, left: 144 }}>
            <svg width="90" height="70" viewBox="0 0 90 70">
              <rect x="0" y="0" width="90" height="70" fill="#8b6914" />
              <rect x="5" y="5" width="80" height="60" fill="#1a3a4a" />
              <ellipse cx="45" cy="40" rx="22" ry="16" fill="#2a5a6a" />
            </svg>
          </div>

          
        </div>

        {/* Mahogany desk surface - closer view */}
        <div className="absolute left-0 right-0 bottom-0 bg-table" style={{ top: 345 }}>
          <svg className="absolute inset-0 w-full h-full opacity-35">
            <defs>
              <pattern id="woodGrain" patternUnits="userSpaceOnUse" width="150" height="8">
                <path d="M0 4 Q35 2 75 4 T150 4" stroke="#4a2d1e" strokeWidth="1.5" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#woodGrain)" />
          </svg>
        </div>

        {/* ===== TABLE ITEMS - Properly arranged around CENTERED card ===== */}
        
        {/* LAMP - At the top of the table, centered at x=720 (center of 1440) */}
        <div 
          className="absolute" 
          style={{ 
            top: 98,
            left: 580,
            zIndex: 10 
          }}
        >
          <svg width="280" height="300" viewBox="0 0 200 220">
            {/* Lamp shade - green banker style */}
            <polygon points="35,50 165,50 180,100 20,100" fill="#1a5a3a" />
            <polygon points="40,55 160,55 172,95 28,95" fill="#228b22" />
            {/* Brass band */}
            <rect x="30" y="46" width="140" height="6" fill="#d4af37" />
            {/* Brass arm */}
            <rect x="92" y="100" width="16" height="90" fill="#d4af37" />
            <rect x="96" y="100" width="8" height="90" fill="#c0a030" />
            {/* Base */}
            <ellipse cx="100" cy="198" rx="50" ry="16" fill="#d4af37" />
            <ellipse cx="100" cy="194" rx="42" ry="12" fill="#c0a030" />
          </svg>
          {/* Subtle ambient glow underneath */}
          <div 
            className="absolute"
            style={{ 
              top: 100,
              left: 50,
              width: 180,
              height: 300,
              background: "radial-gradient(ellipse at center top, rgba(255,215,0,0.12) 0%, rgba(255,215,0,0.05) 40%, transparent 70%)",
            }} 
          />
        </div>

        {/* CIGAR - Left of card (center=720, offset left by 400 = 320) */}
        <div className="absolute" style={{ top: 468, left: 330 }}>
          <svg width="180" height="100" viewBox="0 0 130 70">
            {/* Cigar body */}
            <rect x="0" y="28" width="100" height="18" fill="#8b4513" rx="3" />
            <rect x="0" y="28" width="100" height="7" fill="#a0522d" rx="3" />
            {/* Gold band */}
            <rect x="75" y="26" width="18" height="22" fill="#d4af37" />
            <rect x="77" y="28" width="14" height="18" fill="#c0a030" />
            {/* Ember base */}
<rect x="100" y="30" width="5" height="14" fill="#3d1a0a" />

{/* Soft outer glow */}
<motion.rect x="99" y="29" width="7" height="16" fill="#ff4500" rx="2"
  animate={{ opacity: [0.2, 0.35, 0.2] }}
  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
/>

{/* Mid ember */}
<motion.rect x="100" y="30" width="5" height="14" fill="#ff6b35" rx="1"
  animate={{ opacity: [0.7, 0.9, 0.7] }}
  transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
/>

{/* Hot core */}
<motion.rect x="101" y="32" width="3" height="10" fill="#ffcc66" rx="1"
  animate={{ opacity: [0.8, 1, 0.75, 1, 0.8] }}
  transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
/>
            
          </svg>
        </div>

        {/* MONTBLANC PEN - Right of card (center=720 + 220 = 940) */}
        <div className="absolute" style={{ top: 468, left: 940, transform: "rotate(-120deg)", transformOrigin: "center" }}>

          <svg width="200" height="60" viewBox="0 0 150 45">
            {/* Pen body - black */}
            <rect x="0" y="16" width="105" height="14" fill="#0a0a0a" rx="2" />
            <rect x="0" y="16" width="105" height="5" fill="#1a1a1a" />
            {/* Gold band */}
            <rect x="85" y="14" width="12" height="18" fill="#d4af37" />
            {/* Cap */}
            <rect x="97" y="13" width="48" height="20" fill="#0a0a0a" rx="2" />
            <rect x="97" y="13" width="48" height="7" fill="#1a1a1a" />
            {/* Montblanc star emblem */}
            <circle cx="138" cy="23" r="8" fill="#fff" />
            <polygon points="138,16 140,20 145,20 141,23 143,28 138,25 133,28 135,23 131,20 136,20" fill="#0a0a0a" />
            {/* Nib */}
            <polygon points="0,23 -14,19 -14,27" fill="#d4af37" />
          </svg>
        </div>

        {/* Patrick Bateman - Enters from left edge, stops left of lamp, exits right edge behind lamp */}
        <AnimatePresence>
          {showCharacter && (
            <motion.div
              initial={{ x: -450 }}
              animate={
                animationPhase === "intro" 
                  ? { x: -450 }
                  : animationPhase === "walking"
                  ? { x: 0 }
                  : animationPhase === "throwing" || animationPhase === "spinning" || animationPhase === "landed"
                  ? { x: 0 }
                  : animationPhase === "zooming"
                  ? { x: 1200 }
                  : { x: 1200 }
              }
              transition={{ 
                duration: animationPhase === "walking" ? 1.2 : animationPhase === "zooming" ? 1.2 : 0, 
                ease: [0.25, 0.1, 0.25, 1]
              }}
              className="absolute"
              style={{ left: 350, top: 175, zIndex: 5 }}
            >
              <svg width="120" height="200" viewBox="0 0 120 200" style={{ imageRendering: "pixelated" }}>
                {/* Hair */}
                <rect x="38" y="6" width="44" height="28" fill="#1a0a05" />
                <rect x="33" y="18" width="54" height="20" fill="#1a0a05" />
                
                {/* Face - neutral expression */}
                <rect x="38" y="30" width="44" height="42" fill="#e8d4b8" />
                
                {/* Eyes - calm */}
                <rect x="44" y="42" width="10" height="6" fill="#fff" />
                <rect x="66" y="42" width="10" height="6" fill="#fff" />
                <rect x="47" y="43" width="4" height="4" fill="#4a90a4" />
                <rect x="69" y="43" width="4" height="4" fill="#4a90a4" />
                <rect x="48" y="44" width="2" height="2" fill="#1a1a1a" />
                <rect x="70" y="44" width="2" height="2" fill="#1a1a1a" />
                
                {/* Eyebrows - relaxed */}
                <rect x="44" y="38" width="10" height="3" fill="#1a0a05" />
                <rect x="66" y="38" width="10" height="3" fill="#1a0a05" />
                
                {/* Nose */}
                <rect x="56" y="48" width="8" height="12" fill="#d4b8a0" />
                
                {/* Mouth - neutral */}
                <rect x="52" y="64" width="16" height="4" fill="#a06a5a" />
                
                {/* Neck */}
                <rect x="50" y="72" width="20" height="10" fill="#e8d4b8" />
                
                {/* Black suit */}
                <rect x="24" y="80" width="72" height="90" fill="#1a1a1a" />
                <polygon points="24,80 60,80 50,130 24,130" fill="#2a2a2a" />
                <polygon points="96,80 60,80 70,130 96,130" fill="#2a2a2a" />
                
                {/* White shirt */}
                <rect x="48" y="80" width="24" height="36" fill="#f5f2e8" />
                
                {/* Red tie */}
                <rect x="55" y="84" width="10" height="40" fill="#8b0000" />
                <polygon points="55,124 65,124 60,135" fill="#8b0000" />
                
                {/* Arms */}
                <motion.g
                  animate={animationPhase === "throwing" ? { rotate: -30 } : { rotate: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ transformOrigin: "24px 92px" }}
                >
                  <rect x="4" y="86" width="24" height="45" fill="#1a1a1a" />
                  <rect x="2" y="126" width="20" height="14" fill="#e8d4b8" />
                </motion.g>
                <rect x="92" y="86" width="24" height="45" fill="#1a1a1a" />
                <rect x="94" y="126" width="18" height="12" fill="#e8d4b8" />
                
                
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Business Card - CENTERED, thrown from Patrick's hand */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div
            initial={hasPlayedIntro ? { x: 0, y: 60, rotate: 720, scale: 0.5, opacity: 1 } : { x: -320, y: -120, rotate: 0, scale: 0.15, opacity: 0 }}
            animate={
              hasPlayedIntro
                ? { x: 0, y: 60, rotate: 720, scale: 0.5, opacity: 1 }
                : animationPhase === "intro" || animationPhase === "walking"
                ? { x: -320, y: -120, rotate: 0, scale: 0.15, opacity: 0 }
                : animationPhase === "throwing"
                ? { x: -150, y: -30, rotate: 180, scale: 0.3, opacity: 1 }
                : animationPhase === "spinning"
                ? { x: 0, y: 60, rotate: 720, scale: 0.5, opacity: 1 }
                : animationPhase === "landed"
                ? { x: 0, y: 65, rotate: 722, scale: 0.5, opacity: 1 }
                : { x: 0, y: 60, rotate: 720, scale: 0.5, opacity: 1 }
            }
            transition={{
              duration: hasPlayedIntro ? 0 : animationPhase === "spinning" ? 1 : animationPhase === "landed" ? 0.15 : 0.4,
              ease: animationPhase === "landed" ? "easeOut" : [0.25, 0.46, 0.45, 0.94],
            }}
            className="relative"
          >
            {/* Business Card */}
            <div 
              className="w-[520px] aspect-[1.75/1] bg-card border border-border relative overflow-hidden shadow-lg z-9"
              style={{ imageRendering: "auto" }}
            >
              <div className="relative h-full p-5 flex flex-col justify-between">
                <div className="flex justify-between items-start text-[#4a4a4a]">
                  <div className="space-y-1 text-xs tracking-wide font-[var(--font-pixel)]">
                    <div className="flex items-center gap-2">
                      <Mail size={10} />
                      <span>shauryachopra@zohomail.in</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={10} />
                      <span>+91 9137887901</span>
                    </div>
                  </div>
                  <div className="text-xs text-right tracking-wide font-[var(--font-pixel)]">
                    <p className="text-[#2a2520]">Mumbai University</p>
                    <p className="text-[#6a6a6a] text-[10px]">BTech CS + Cyber Security</p>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <h1 className="text-[#2a2520] tracking-[0.2em] text-sm font-[var(--font-pixel)] font-bold">
                    SHAURYA CHOPRA
                  </h1>
                  <p className="text-[#6a6a6a] text-xs tracking-wide font-[var(--font-pixel)]">
                    Exploring AI Engineering &amp; Cyber Security
                  </p>
                </div>

                <div className="flex justify-center gap-6">
                  <a 
                    href="https://www.linkedin.com/in/shaurya-chopra-1a1922379/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playClick()}
                    className="flex items-center gap-1.5 text-[#4a4a4a] hover:text-[#0077b5] transition-colors font-[var(--font-pixel)]"
                  >
                    <Linkedin size={12} />
                    <span className="text-xs">LinkedIn</span>
                  </a>
                  <a 
                    href="https://github.com/shauryach0pra"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playClick()}
                    className="flex items-center gap-1.5 text-[#4a4a4a] hover:text-[#2a2520] transition-colors font-[var(--font-pixel)]"
                  >
                    <Github size={12} />
                    <span className="text-xs">GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Hint text */}
      {animationPhase === "ready" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute text-white/50 text-xs font-mono z-10"
          style={{ bottom: 24, left: 720, transform: "translateX(-50%)" }}
        >
        </motion.p>
      )}
    </motion.div>
  )
}

// ============ PROJECTS SCENE - Beach Bar with Mojito Glass ============

// Ice cube positions inside the glass (in SVG viewBox coordinates)
const ICE_CUBE_POSITIONS = [
  { x: 28, y: 50, isRight: false },   // Top left
  { x: 52, y: 50, isRight: true },    // Top right
  { x: 28, y: 80, isRight: false },   // Middle left
  { x: 52, y: 80, isRight: true },    // Middle right
  { x: 40, y: 110, isRight: false },  // Bottom center
]

// Placeholder project data for 5 ice cubes
const PLACEHOLDER_PROJECTS = [
  { id: 1, name: "Fakebook", description: "Simulates an OTP grabbing attack using social engineering techniques", techStack: ["Next.js", "Typescript", "Tailwind CSS"], liveDemo: "https://fakebook.shauryachopra.dev" },
  { id: 2, name: "Project Beta", description: "An innovative mobile-first platform designed for seamless user experience across all devices.", techStack: ["Next.js", "TypeScript", "Tailwind"], liveDemo: "https://example.com" },
  { id: 3, name: "Project Gamma", description: "A robust backend system handling millions of requests with high availability and fault tolerance.", techStack: ["Python", "FastAPI", "PostgreSQL"], liveDemo: "https://example.com" },
  { id: 4, name: "Project Delta", description: "Machine learning powered analytics dashboard providing actionable insights from complex data.", techStack: ["TensorFlow", "React", "D3.js"], liveDemo: "https://example.com" },
  { id: 5, name: "Project Epsilon", description: "A security-focused authentication system with multi-factor authentication and encryption.", techStack: ["Go", "Redis", "Docker"], liveDemo: "https://example.com" },
]

function ProjectsScene({ 
  projects, 
  selectedProject, 
  onSelectProject, 
  onCloseProject,
  playClick,
}: { 
  projects: Project[]
  selectedProject: Project | null
  onSelectProject: (p: Project) => void
  onCloseProject: () => void
  playClick: () => void
}) {
  const [clickedCubes, setClickedCubes] = useState<Set<number>>(new Set())
  const [hoveredCube, setHoveredCube] = useState<number | null>(null)
  const [selectedCubeIndex, setSelectedCubeIndex] = useState<number | null>(null)

  const handleCubeClick = (index: number) => {
    playClick()
    setClickedCubes(prev => new Set(prev).add(index))
    setSelectedCubeIndex(index)
  }

  const handleClosePopup = () => {
    setSelectedCubeIndex(null)
  }

  // Get popup position based on ice cube position
  const getPopupPosition = (cubeIndex: number) => {
    const cube = ICE_CUBE_POSITIONS[cubeIndex]
    // SVG viewBox is 80x150, rendered at 140x260
    const scaleY = 260 / 150
    const cubeRelativeY = cube.y * scaleY
    
    // Popup appears on SAME side as the ice cube
    // Left cubes (isRight: false) = popup on left, arrow points right
    // Right cubes (isRight: true) = popup on right, arrow points left
    const popupOnLeft = !cube.isRight
    
    return {
      relativeX: popupOnLeft ? -380 : 160,
      relativeY: cubeRelativeY - 100,
      arrowPointsRight: popupOnLeft // Arrow points toward the cube
    }
  }

  // Render ice cube SVG - normal or cracked texture
  const renderIceCube = (index: number, x: number, y: number, isClickable: boolean = true) => {
    const isClicked = clickedCubes.has(index)
    const isHovered = hoveredCube === index
    const isSelected = selectedCubeIndex === index
    
    // Cracked ice cube texture
    if (isClicked) {
      return (
        <g 
          key={index} 
          style={{ cursor: isClickable ? 'pointer' : 'default' }}
          onClick={isClickable ? () => handleCubeClick(index) : undefined}
          onMouseEnter={isClickable ? () => setHoveredCube(index) : undefined}
          onMouseLeave={isClickable ? () => setHoveredCube(null) : undefined}
        >
          {/* Base cracked ice cube */}
          <polygon 
            points={`${x-10},${y} ${x},${y-7} ${x+10},${y} ${x+10},${y+14} ${x},${y+21} ${x-10},${y+14}`} 
            fill={isHovered || isSelected ? "#b8e8f0" : "#d8f0f0"} 
            stroke={isHovered || isSelected ? "#60a0b0" : "#90b8c0"} 
            strokeWidth="1.5" 
          />
          {/* Left face with crack */}
          <polygon points={`${x-10},${y} ${x},${y-7} ${x},${y+7} ${x-10},${y+14}`} fill={isHovered || isSelected ? "#c8f0f8" : "#e8f8f8"} />
          {/* Right face */}
          <polygon points={`${x},${y-7} ${x+10},${y} ${x+10},${y+14} ${x},${y+7}`} fill={isHovered || isSelected ? "#a0d8e8" : "#c8e8f0"} />
          {/* Top face */}
          <polygon points={`${x-10},${y} ${x},${y-7} ${x+10},${y} ${x},${y+3}`} fill="#fff" opacity="0.7" />
          
          {/* Crack lines */}
          <line x1={x-6} y1={y+2} x2={x-2} y2={y+8} stroke="#70a0b0" strokeWidth="1" />
          <line x1={x-2} y1={y+8} x2={x+1} y2={y+5} stroke="#70a0b0" strokeWidth="1" />
          <line x1={x+1} y1={y+5} x2={x+4} y2={y+12} stroke="#70a0b0" strokeWidth="1" />
          <line x1={x-2} y1={y+8} x2={x-5} y2={y+13} stroke="#70a0b0" strokeWidth="0.8" />
          <line x1={x+3} y1={y-2} x2={x+6} y2={y+4} stroke="#70a0b0" strokeWidth="0.8" />
          
          {/* Number label */}
          <text x={x} y={y+12} textAnchor="middle" fill="#2a6a7a" fontSize="8" fontWeight="bold" fontFamily="monospace">{index + 1}</text>
        </g>
      )
    }
    
    // Normal ice cube texture
    return (
      <g 
        key={index} 
        style={{ cursor: isClickable ? 'pointer' : 'default' }}
        onClick={isClickable ? () => handleCubeClick(index) : undefined}
        onMouseEnter={isClickable ? () => setHoveredCube(index) : undefined}
        onMouseLeave={isClickable ? () => setHoveredCube(null) : undefined}
      >
        <polygon 
          points={`${x-10},${y} ${x},${y-7} ${x+10},${y} ${x+10},${y+14} ${x},${y+21} ${x-10},${y+14}`} 
          fill={isHovered ? "#c8f0f8" : "#e8f8f8"} 
          stroke={isHovered ? "#70b8d0" : "#c0d8dc"} 
          strokeWidth="1" 
        />
        <polygon points={`${x-10},${y} ${x},${y-7} ${x},${y+7} ${x-10},${y+14}`} fill={isHovered ? "#d8f4fc" : "#f4fcfc"} />
        <polygon points={`${x},${y-7} ${x+10},${y} ${x+10},${y+14} ${x},${y+7}`} fill={isHovered ? "#b8e4f0" : "#dceef4"} />
        <polygon points={`${x-10},${y} ${x},${y-7} ${x+10},${y} ${x},${y+3}`} fill="#fff" opacity="0.85" />
        {/* Shine */}
        <polygon points={`${x-7},${y+2} ${x-3},${y-2} ${x-3},${y+6} ${x-7},${y+10}`} fill="#fff" opacity="0.5" />
        {/* Number label */}
        <text x={x} y={y+12} textAnchor="middle" fill={isHovered ? "#0a4a5a" : "#2a6a7a"} fontSize="8" fontWeight="bold" fontFamily="monospace">{index + 1}</text>
      </g>
    )
  }

  // Base dimensions for positioning (1440x900)
  const BASE_W = 1440
  const BASE_H = 900

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full relative overflow-hidden"
      style={{ width: BASE_W, height: BASE_H }}
    >
      {/* FULL SUNSET BEACH BACKGROUND */}
      <div className="absolute inset-0" style={{ imageRendering: "pixelated" }}>
        {/* Sky gradient - warm sunset */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff6b35] via-[#ff8c5a] to-[#ffb088]" />
        
        {/* Large sun */}
        <div className="absolute" style={{ top: 18, right: 216 }}>
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="60" fill="#ff4500" />
            <circle cx="90" cy="90" r="72" fill="#ff6347" opacity="0.3" />
            <circle cx="90" cy="90" r="85" fill="#ff7f50" opacity="0.12" />
          </svg>
        </div>

        {/* Clouds - fixed pixel positions */}
        {[{ x: 86, y: 90 }, { x: 461, y: 90 }, { x: 835, y: 90 }, { x: 1224, y: 90 }].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: pos.x, top: pos.y }}
            animate={{ x: [0, 30, 0] }}
            transition={{ duration: 16 + i * 3, repeat: Infinity }}
          >
            <svg width="110" height="50" viewBox="0 0 110 50">
              <ellipse cx="30" cy="30" rx="28" ry="18" fill="#fff" opacity="0.8" />
              <ellipse cx="55" cy="24" rx="35" ry="22" fill="#fff" opacity="0.85" />
              <ellipse cx="85" cy="30" rx="24" ry="16" fill="#fff" opacity="0.8" />
            </svg>
          </motion.div>
        ))}

        {/* Ocean with depth perspective */}
        <div className="absolute left-0 right-0 overflow-hidden" style={{ top: 270, height: 180 }}>
  {/* Base ocean gradient - darker at top (distant), lighter closer */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#2563a3] via-[#3d8eb9] to-[#4da6cc]" />
  {/* Wave layers with perspective scaling */}
  <svg className="absolute inset-0 w-full h-full">
    <defs>
      {/* Distant waves (smaller, thinner) */}
      <pattern id="waves1" patternUnits="userSpaceOnUse" width="150" height="15">
        <path 
          d="M0 7.5 Q37.5 4 75 7.5 Q112.5 11 150 7.5" 
          stroke="#ffffff" 
          strokeWidth="1.5" 
          fill="none" 
          opacity="0.15"
        />
      </pattern>
      {/* Mid-distance waves */}
      <pattern id="waves2" patternUnits="userSpaceOnUse" width="100" height="25">
        <path 
          d="M0 12.5 Q25 6 50 12.5 Q75 19 100 12.5" 
          stroke="#a8d8ea" 
          strokeWidth="2" 
          fill="none" 
          opacity="0.25"
        />
      </pattern>
      {/* Close waves (larger, bolder) */}
      <pattern id="waves3" patternUnits="userSpaceOnUse" width="80" height="35">
        <path 
          d="M0 17.5 Q20 8 40 17.5 Q60 27 80 17.5" 
          stroke="#cce7f0" 
          strokeWidth="3" 
          fill="none" 
          opacity="0.35"
        />
      </pattern>
      
    </defs>
    {/* Apply wave patterns - top to bottom = far to near */}
    {/* Distant waves at top */}
    <rect width="100%" height="35%" fill="url(#waves1)" />
    {/* Mid-distance waves */}
    <rect width="100%" height="70%" y="15%" fill="url(#waves2)" />
    {/* Close waves at bottom */}
    <rect width="100%" height="50%" y="50%" fill="url(#waves3)" />
    {/* Foam texture overlay */}
    <rect width="100%" height="100%" fill="url(#foam)" opacity="0.3" />
  </svg>
  {/* Atmospheric haze at top (distant) */}
  <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#7fb3d1]/30 to-transparent" style={{ height: 72 }} />
  {/* Depth clarity at bottom (closer) */}
  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-[#4da6cc]/20" style={{ height: 54 }} />
</div>
        {/* Beach sand with texture */}
        <div className="absolute left-0 right-0 bg-gradient-to-b from-[#f5d76e] to-[#d4a520]" style={{ top: 432, height: 378 }}>
          <svg className="absolute inset-0 w-full h-full opacity-25">
            <defs>
              <pattern id="sandTex" patternUnits="userSpaceOnUse" width="20" height="20">
                <circle cx="5" cy="5" r="1" fill="#c9a030" />
                <circle cx="15" cy="12" r="1.5" fill="#b89020" />
                <circle cx="8" cy="17" r="1" fill="#c9a030" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sandTex)" />
          </svg> 
          {/* Cute animated crab - left side of beach */}
<motion.div
  className="absolute z-10"
  style={{ left: 288, top: 50 }}
  animate={{ 
    x: [0, 20, 0, -15, 0],
  }}
  transition={{ 
    duration: 8,
    repeat: Infinity,
    ease: "easeInOut"
  }}
>
  <svg width="50" height="40" viewBox="0 0 50 40">
    {/* Crab body */}
    <ellipse cx="25" cy="25" rx="12" ry="9" fill="#ff6347" />
    <ellipse cx="25" cy="25" rx="10" ry="7" fill="#ff7f66" />
    
    {/* Eyes on stalks */}
    <motion.g
      animate={{ 
        rotate: [0, -10, 10, 0],
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ transformOrigin: "20px 20px" }}
    >
      <line x1="20" y1="20" x2="20" y2="14" stroke="#ff6347" strokeWidth="2" />
      <circle cx="20" cy="12" r="3" fill="#fff" />
      <circle cx="20" cy="12" r="1.5" fill="#000" />
    </motion.g>
    
    <motion.g
      animate={{ 
        rotate: [0, 10, -10, 0],
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.1
      }}
      style={{ transformOrigin: "30px 20px" }}
    >
      <line x1="30" y1="20" x2="30" y2="14" stroke="#ff6347" strokeWidth="2" />
      <circle cx="30" cy="12" r="3" fill="#fff" />
      <circle cx="30" cy="12" r="1.5" fill="#000" />
    </motion.g>
    
    {/* Left claw */}
    <motion.g
      animate={{ 
        rotate: [-15, -25, -15],
      }}
      transition={{ 
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ transformOrigin: "12px 24px" }}
    >
      <ellipse cx="8" cy="24" rx="5" ry="3" fill="#ff6347" transform="rotate(-20 8 24)" />
      <path d="M 8 24 L 5 26 L 3 24 Z" fill="#ff6347" />
      <path d="M 8 24 L 5 22 L 3 24 Z" fill="#ff4500" />
    </motion.g>
    
    {/* Right claw */}
    <motion.g
      animate={{ 
        rotate: [15, 25, 15],
      }}
      transition={{ 
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.75
      }}
      style={{ transformOrigin: "38px 24px" }}
    >
      <ellipse cx="42" cy="24" rx="5" ry="3" fill="#ff6347" transform="rotate(20 42 24)" />
      <path d="M 42 24 L 45 26 L 47 24 Z" fill="#ff6347" />
      <path d="M 42 24 L 45 22 L 47 24 Z" fill="#ff4500" />
    </motion.g>
    
    {/* Legs - left side */}
    <motion.line 
      x1="18" y1="30" x2="15" y2="36" 
      stroke="#ff6347" 
      strokeWidth="2"
      animate={{ x2: [15, 13, 15] }}
      transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
    />
    <motion.line 
      x1="20" y1="31" x2="17" y2="37" 
      stroke="#ff6347" 
      strokeWidth="2"
      animate={{ x2: [17, 15, 17] }}
      transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
    />
    <motion.line 
      x1="22" y1="32" x2="20" y2="38" 
      stroke="#ff6347" 
      strokeWidth="2"
      animate={{ x2: [20, 18, 20] }}
      transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
    />
    
    {/* Legs - right side */}
    <motion.line 
      x1="32" y1="30" x2="35" y2="36" 
      stroke="#ff6347" 
      strokeWidth="2"
      animate={{ x2: [35, 37, 35] }}
      transition={{ duration: 0.8, repeat: Infinity, delay: 0.1 }}
    />
    <motion.line 
      x1="30" y1="31" x2="33" y2="37" 
      stroke="#ff6347" 
      strokeWidth="2"
      animate={{ x2: [33, 35, 33] }}
      transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
    />
    <motion.line 
      x1="28" y1="32" x2="30" y2="38" 
      stroke="#ff6347" 
      strokeWidth="2"
      animate={{ x2: [30, 32, 30] }}
      transition={{ duration: 0.8, repeat: Infinity, delay: 0.5 }}
    />
    
    {/* Mouth */}
    <path d="M 22 27 Q 25 29 28 27" stroke="#000" strokeWidth="0.5" fill="none" />
  </svg>
</motion.div>
          {/* Beach ball decoration */}
          <motion.div
            className="absolute"
            style={{ left: 1152, top: 60 }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <svg width="60" height="60" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="28" fill="#fff" stroke="#333" strokeWidth="2" />
              <path d="M 30 2 A 28 28 0 0 1 30 58" fill="#ff6b6b" />
              <path d="M 30 2 A 28 28 0 0 0 2 30" fill="#4ecdc4" />
              <path d="M 30 58 A 28 28 0 0 1 2 30" fill="#ffe66d" />
              <path d="M 30 58 A 28 28 0 0 0 58 30" fill="#95e1d3" />
              <path d="M 58 30 A 28 28 0 0 0 30 2" fill="#ff6b9d" />
              <circle cx="30" cy="30" r="28" fill="none" stroke="#333" strokeWidth="2" />
              <ellipse cx="30" cy="30" rx="28" ry="14" fill="none" stroke="#333" strokeWidth="1.5" opacity="0.6" />
              <ellipse cx="30" cy="30" rx="14" ry="28" fill="none" stroke="#333" strokeWidth="1.5" opacity="0.6" />
            </svg>
          </motion.div>
        </div>

        {/* Palm trees */}
        {/* Palm trees - fixed pixel positions */}
        {[{ x: 29, s: 0.85 }, { x: 173, s: 1.05 }, { x: 1210, s: 0.85 }, { x: 1368, s: 1.05 }].map((tree, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: tree.x, top: 300, transform: `scale(${tree.s})` }}
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.4 }}
          >
            <svg width="100" height="220" viewBox="0 0 100 220">
              <path d="M45 220 Q43 160 50 100 Q53 50 45 25" fill="none" stroke="#8b4513" strokeWidth="14" />
              <ellipse cx="25" cy="22" rx="35" ry="10" fill="#228b22" transform="rotate(-35 25 22)" />
              <ellipse cx="75" cy="22" rx="35" ry="10" fill="#228b22" transform="rotate(35 75 22)" />
              <ellipse cx="45" cy="15" rx="40" ry="9" fill="#2e8b2e" transform="rotate(-8 45 15)" />
              <ellipse cx="55" cy="28" rx="32" ry="8" fill="#3cb371" transform="rotate(15 55 28)" />
            </svg>
          </motion.div>
        ))}

        {/* WOODEN BAR COUNTER */}
        <div className="absolute left-0 right-0" style={{ bottom: -90, height: 378 }}>
          <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
            <rect x="0" y="10" width="2400" height="80" fill="#cd853f" />
            {[...Array(32)].map((_, i) => (
              <path key={i} d={`M${20 + i * 38} 55 Q${30 + i * 38} 65 ${20 + i * 38} 85`} stroke="#b8860b" strokeWidth="1.5" fill="none" opacity="0.4" />
            ))}
            <rect x="0" y="90" width="1200" height="250" fill="#a0522d" />
            {[...Array(16)].map((_, i) => (
              <g key={i}>
                <rect x={i * 75} y="92" width="72" height="245" fill="#b8652e" stroke="#8b4513" strokeWidth="3" />
                <line x1={20 + i * 75} y1="100" x2={20 + i * 75} y2="330" stroke="#8b4513" strokeWidth="1" opacity="0.3" />
                <line x1={40 + i * 75} y1="100" x2={40 + i * 75} y2="330" stroke="#8b4513" strokeWidth="1" opacity="0.3" />
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Instruction text */}
      <div className="absolute z-10" style={{ top: 45, left: 720, transform: "translateX(-50%)" }}>
        
      </div>

      {/* Mojito Glass Container - Centered */}
      <div
        className="absolute z-10 left-1/2 -translate-x-1/2"
        style={{ top: '410px' }}
      >
        <svg width="140" height="260" viewBox="0 0 80 150">
  <defs>
    <linearGradient id="mojitoLiquid" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#7FD67F" stopOpacity="0.75" />
      <stop offset="100%" stopColor="#5FB85F" stopOpacity="0.9" />
    </linearGradient>
    <clipPath id="glassClip">
      <polygon points="12,22 68,22 63,145 17,145" />
    </clipPath>
  </defs>
  
  {/* Glass outline */}
  <polygon points="10,20 70,20 65,148 15,148" fill="#fff" opacity="0.3" stroke="#fff" strokeWidth="2" />
  
  {/* Liquid */}
  <rect x="12" y="22" width="56" height="123" fill="url(#mojitoLiquid)" clipPath="url(#glassClip)" />
  
 {/* Straw - MOVED HERE (behind ice cubes) */}
<rect x="52" y="-15" width="7" height="150" fill="#ff6b6b" rx="1" />
<rect x="52" y="-15" width="3" height="150" fill="#ff8787" rx="1" />
  
  {/* Ice cubes inside glass with bobbing animation */}
  {ICE_CUBE_POSITIONS.map((pos, i) => {
    return (
      <motion.g
        key={i}
        animate={{ 
          y: [0, -3, 0, 2, 0],
        }}
        transition={{ 
          duration: 3 + i * 0.3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.4
        }}
      >
        {renderIceCube(i, pos.x, pos.y)}
      </motion.g>
    )
  })}
  
  {/* Mint leaves */}
  <ellipse cx="26" cy="26" rx="9" ry="5" fill="#228b22" transform="rotate(-15 26 26)" />
  <ellipse cx="40" cy="22" rx="11" ry="6" fill="#2e8b2e" transform="rotate(8 40 22)" />
  <ellipse cx="56" cy="26" rx="8" ry="4" fill="#228b22" />
  
  {/* LIME - moved before straw so it appears behind */}
{/* Lime slice on rim - more realistic */}
<g transform="translate(64, 18)">
  {/* Outer rind */}
  <circle cx="0" cy="0" r="12" fill="#32cd32" stroke="#228b22" strokeWidth="2" />
  {/* Inner flesh */}
  <circle cx="0" cy="0" r="9" fill="#90EE90" />
  {/* Segments */}
  <line x1="0" y1="-9" x2="0" y2="9" stroke="#228b22" strokeWidth="1" opacity="0.4" />
  <line x1="-9" y1="0" x2="9" y2="0" stroke="#228b22" strokeWidth="1" opacity="0.4" />
  <line x1="-6" y1="-6" x2="6" y2="6" stroke="#228b22" strokeWidth="1" opacity="0.4" />
  <line x1="-6" y1="6" x2="6" y2="-6" stroke="#228b22" strokeWidth="1" opacity="0.4" />
  {/* Center pulp */}
  <circle cx="0" cy="0" r="2" fill="#fff" opacity="0.6" />
</g>

{/* Straw - NOW APPEARS IN FRONT */}


</svg>

     {/* Glassmorphism Popup - positioned relative to glass */}
<AnimatePresence>
  {selectedCubeIndex !== null && (
    <motion.div
  key="project-popup" // Keep a static key so it doesn't remount on every click
  initial={false}     // This removes the "less opaque to more opaque" start
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.9 }}
  className="absolute z-50"
  style={{
    left: getPopupPosition(selectedCubeIndex).relativeX,
    top: getPopupPosition(selectedCubeIndex).relativeY,
    width: '360px',
  }}
>
      {/* Glassmorphism card - white base */}
      <div 
        className="relative rounded-2xl p-6 border border-white/60"
        style={{
          background: 'rgba(255, 255, 255, 0.55)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255,255,255,0.7)',
        }}
      >
        {/* Arrow/tail indicator pointing to ice cube */}
        <div 
          className="absolute"
          style={{
            top: 100,
            ...(getPopupPosition(selectedCubeIndex).arrowPointsRight ? {
              right: '-16px',
              width: 0,
              height: 0,
              borderTop: '16px solid transparent',
              borderBottom: '16px solid transparent',
              borderLeft: '16px solid rgba(255, 255, 255, 0.55)',
            } : {
              left: '-16px',
              width: 0,
              height: 0,
              borderTop: '16px solid transparent',
              borderBottom: '16px solid transparent',
              borderRight: '16px solid rgba(255, 255, 255, 0.55)',
            })
          }}
        />

        {/* Conditional content based on project index */}
        {selectedCubeIndex > 0 ? (
          /* For projects 2-5: Show ONLY "Coming Soon" with same spacing */
          <div className="space-y-4">
            <div className="flex items-center justify-center py-12">
              <div className="text-center px-6">
                <div className="text-7xl mb-4">🚧</div>
                <p className="text-gray-800 font-bold text-xl mb-2">Coming Soon</p>
                <p className="text-gray-600 text-base">This project is under development</p>
              </div>
            </div>
          </div>
        ) : (
          /* For project 1: Show full content */
          <div className="space-y-4">
            <h3 className="text-gray-900 font-bold text-2xl pr-8">
              {PLACEHOLDER_PROJECTS[selectedCubeIndex]?.name || `Project ${selectedCubeIndex + 1}`}
            </h3>
            
            <p className="text-gray-700 text-base leading-relaxed">
              {PLACEHOLDER_PROJECTS[selectedCubeIndex]?.description || "Project description placeholder"}
            </p>
            
            {/* Tech stack tags */}
            <div className="flex flex-wrap gap-2">
              {(PLACEHOLDER_PROJECTS[selectedCubeIndex]?.techStack || ["Tech 1", "Tech 2"]).map((tech, i) => (
                <span 
                  key={i}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-white/40 text-gray-800 border border-white/50"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Live demo link - Mojito green CTA */}
            {PLACEHOLDER_PROJECTS[selectedCubeIndex]?.liveDemo && (
              <a 
                href={PLACEHOLDER_PROJECTS[selectedCubeIndex].liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClick()}
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-xl text-white text-base font-semibold transition-all"
                style={{
                  background: '#5FB85F',
                  boxShadow: '0 4px 12px rgba(95, 184, 95, 0.35)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#7FD67F'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(127, 214, 127, 0.45)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#5FB85F'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(95, 184, 95, 0.35)'
                }}
              >
                <Monitor size={18} />
                View Live Demo
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )}
</AnimatePresence>
      </div>
    </motion.div>
  )
}

// ============ TECHNOLOGIES SCENE - Park Canvas with Location-based Skills ============
interface SkillCategory {
  name: string
  color: string
  importance: number
  skills: string[]
}

// Skill zones - each color reveals skill only when painted over its zone
const skillZones = [
  { id: "violet", color: "#5225a1", skills: "HTML", zone: { x: 50, y: 50, w: 180, h: 120 } },
  { id: "blue", color: "#2548a1", skills: "CSS", zone: { x: 370, y: 50, w: 180, h: 120 } },
  { id: "green", color: "#44a125", skills: "Java", zone: { x: 50, y: 200, w: 180, h: 120 } },
  { id: "yellow", color: "#ebd234", skills: "Python", zone: { x: 370, y: 200, w: 180, h: 120 } },
  { id: "orange", color: "#c98526", skills: "Git", zone: { x: 200, y: 125, w: 180, h: 120 } },
  { id: "red", color: "#a12828", skills: "Linux", zone: { x: 200, y: 260, w: 180, h: 80 } },
]

function TechnologiesScene({ skills, playClick }: { skills: SkillCategory[], playClick: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedColor, setSelectedColor] = useState("violet")
  const [isDrawing, setIsDrawing] = useState(false)
  const [revealedSkills, setRevealedSkills] = useState<{[key: string]: boolean}>({})
  const lastPosRef = useRef<{x: number, y: number} | null>(null)
  const paintedZonesRef = useRef<{[key: string]: number}>({})

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Base linen color
    ctx.fillStyle = "#f0ebe3"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Horizontal linen lines
    ctx.strokeStyle = "rgba(180, 170, 155, 0.35)"
    ctx.lineWidth = 1
    for (let y = 0; y < canvas.height; y += 4) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Vertical linen lines (lighter)
    ctx.strokeStyle = "rgba(180, 170, 155, 0.18)"
    ctx.lineWidth = 1
    for (let x = 0; x < canvas.width; x += 4) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // Subtle noise dots
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 1.5 + 0.5
      ctx.fillStyle = `rgba(160, 148, 130, ${0.1 + Math.random() * 0.15})`
      ctx.fillRect(x, y, size, size)
    }
}, [])

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx || !isDrawing) return

    const rect = canvas.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height

    const colorData = skillZones.find(c => c.id === selectedColor)
    if (!colorData) return

    // Large brush size
    const brushSize = 100

    ctx.fillStyle = colorData.color
    ctx.globalAlpha = 0.9
    
    // Fill grid cell
    const gridX = Math.floor(x / brushSize) * brushSize
    const gridY = Math.floor(y / brushSize) * brushSize
    ctx.fillRect(gridX, gridY, brushSize, brushSize)
    
    // Fill between for smoother strokes
    if (lastPosRef.current) {
      const dx = x - lastPosRef.current.x
      const dy = y - lastPosRef.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const steps = Math.ceil(dist / (brushSize / 2))
      for (let i = 0; i < steps; i++) {
        const ix = lastPosRef.current.x + (dx * i) / steps
        const iy = lastPosRef.current.y + (dy * i) / steps
        ctx.fillRect(Math.floor(ix / brushSize) * brushSize, Math.floor(iy / brushSize) * brushSize, brushSize, brushSize)
      }
    }
    
    ctx.globalAlpha = 1
    lastPosRef.current = { x, y }

    // Check if painting in this color's zone
    const zone = colorData.zone
    if (x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h) {
      paintedZonesRef.current[selectedColor] = (paintedZonesRef.current[selectedColor] || 0) + 1
      
      // Reveal skill after enough painting in the zone
      if (paintedZonesRef.current[selectedColor] > 8 && !revealedSkills[selectedColor]) {
        setRevealedSkills(prev => ({ ...prev, [selectedColor]: true }))
      }
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect && canvasRef.current) {
      lastPosRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * canvasRef.current.width,
        y: ((e.clientY - rect.top) / rect.height) * canvasRef.current.height
      }
    }
    draw(e)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full relative overflow-hidden"
      style={{ width: 1440, height: 900 }}
    >
       {/* Enhanced Park background with depth and atmosphere */}
      <div className="absolute inset-0" style={{ imageRendering: "pixelated" }}>
        {/* Sky with gradient and atmospheric depth */}
        <div className="absolute top-0 left-0 right-0" style={{ height: 450 }}>
          <div className="absolute inset-0 bg-gradient-to-b from-[#6eb5e8] via-[#87ceeb] to-[#b8dff5]" />
          {/* Distant haze */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/20 to-transparent" />
        </div>
        
        {/* Sun with glow */}
        <div className="absolute" style={{ top: 45, right: 144 }}>
  {/* Glow effect */}
  <div className="absolute inset-0 blur-2xl">
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r="50" fill="#ffe87c" opacity="0.3" />
    </svg>
  </div>
  
  {/* Sun */}
  <svg width="90" height="90" viewBox="0 0 90 90">
    <defs>
      <radialGradient id="sunGrad" cx="40%" cy="40%">
        <stop offset="0%" stopColor="#fff9e6" />
        <stop offset="60%" stopColor="#ffd700" />
        <stop offset="100%" stopColor="#ffb700" />
      </radialGradient>
    </defs>
    
    {/* Sun rays - now rendered first (behind) */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <line 
        key={angle} 
        x1="45" 
        y1="45" 
        x2={45 + Math.cos(angle * Math.PI / 180) * 40} 
        y2={45 + Math.sin(angle * Math.PI / 180) * 40} 
        stroke="#ffd700" 
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    ))}
    
    {/* Sun circle - now rendered last (on top) */}
    <circle cx="45" cy="45" r="28" fill="url(#sunGrad)" />
  </svg>
</div>

        {/* Clouds with shadows and depth - fixed pixel positions */}
        {[
          { x: 115, y: 54, scale: 1, duration: 22 },
          { x: 504, y: 54, scale: 0.85, duration: 26 },
          { x: 936, y: 54, scale: 1.1, duration: 20 }
        ].map((cloud, i) => (
          <motion.div 
            key={i} 
            className="absolute" 
            style={{ left: cloud.x, top: cloud.y, transform: `scale(${cloud.scale})` }}
            animate={{ x: [0, 40, 0] }} 
            transition={{ duration: cloud.duration, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Cloud shadow */}
            <svg width="130" height="65" viewBox="0 0 130 65" className="opacity-20 blur-sm" style={{ transform: 'translate(3px, 3px)' }}>
              <ellipse cx="32" cy="40" rx="30" ry="20" fill="#4a5568" />
              <ellipse cx="65" cy="33" rx="38" ry="26" fill="#4a5568" />
              <ellipse cx="100" cy="40" rx="26" ry="18" fill="#4a5568" />
            </svg>
            {/* Cloud */}
            <svg width="130" height="65" viewBox="0 0 130 65" className="absolute top-0 left-0">
              <defs>
                <radialGradient id={`cloudGrad${i}`} cx="50%" cy="40%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#f0f4f8" />
                </radialGradient>
              </defs>
              <ellipse cx="32" cy="40" rx="30" ry="20" fill={`url(#cloudGrad${i})`} />
              <ellipse cx="65" cy="33" rx="38" ry="26" fill={`url(#cloudGrad${i})`} />
              <ellipse cx="100" cy="40" rx="26" ry="18" fill={`url(#cloudGrad${i})`} />
            </svg>
          </motion.div>
        ))}

        

        {/* Grass with rich texture and depth */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-[#2a8b2a] via-[#228b22] to-[#1e7a1e]" style={{ height: 468 }}>
          {/* Grass blade texture overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-40">
            <defs>
              <pattern id="grassTex" patternUnits="userSpaceOnUse" width="35" height="35">
                <line x1="17" y1="35" x2="17" y2="18" stroke="#1a6b1a" strokeWidth="2.5" />
                <line x1="8" y1="35" x2="10" y2="20" stroke="#1a6b1a" strokeWidth="1.8" />
                <line x1="26" y1="35" x2="24" y2="20" stroke="#1a6b1a" strokeWidth="1.8" />
                <line x1="13" y1="35" x2="12" y2="23" stroke="#156515" strokeWidth="1.5" />
                <line x1="22" y1="35" x2="23" y2="23" stroke="#156515" strokeWidth="1.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grassTex)" />
          </svg>
          
          {/* Ground shadow gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
        </div>

        {/* Trees - fixed pixel positions (bottom: 48% of 900 = 432 from top = 468 from bottom) */}
        {[{ x: 29, s: 1.1 }, { x: 1267, s: 1.05 }, { x: 115, s: 0.8 }, { x: 1152, s: 0.9 }].map((tree, i) => (
          <motion.div key={i} className="absolute" style={{ bottom: 468, left: tree.x, transform: `scale(${tree.s})` }}
            animate={{ rotate: [-1, 1, -1] }} transition={{ duration: 4.5, repeat: Infinity, delay: i * 0.3 }}>
            <svg width="130" height="200" viewBox="0 0 130 200">
              <rect x="52" y="120" width="26" height="80" fill="#8b4513" />
              <ellipse cx="65" cy="75" rx="55" ry="50" fill="#228b22" />
              <ellipse cx="65" cy="48" rx="45" ry="42" fill="#2e8b2e" />
              <ellipse cx="65" cy="28" rx="32" ry="28" fill="#228b22" />
            </svg>
          </motion.div>
        ))}

        {/* Flowers with Bees - fixed pixel positions */}
        {[...Array(14)].map((_, i) => (
          <div key={i} className="absolute" style={{ left: 58 + (i * 94), bottom: 54 + (i % 4) * 54 }}>
            {/* Flower */}
            <motion.div
              animate={{ y: [0, -3, 0] }} 
              transition={{ duration: 2 + (i % 3), repeat: Infinity }}
            >
              <svg width="18" height="28" viewBox="0 0 18 28">
                <defs>
                  <filter id={`flowerGlow${i}`}>
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Stem - now on every flower */}
                <line x1="9" y1="28" x2="9" y2="12" stroke="#228b22" strokeWidth="2" />
                
                {/* Flower petals */}
                <circle cx="9" cy="8" r="6" fill={["#ff69b4", "#ffd700", "#ff6347", "#9370db"][i % 4]} filter={`url(#flowerGlow${i})`} />
                
                {/* Flower center */}
                <circle cx="9" cy="8" r="2" fill="#ffff00" />
              </svg>
            </motion.div>

            {/* Bee flying around flower (only show on some flowers) */}
            {i % 3 === 0 && (
              <motion.div
                className="absolute"
                style={{ left: '5px', top: '0px' }}
                animate={{
                  x: [0, 15, 10, -5, 0],
                  y: [0, -8, -15, -10, 0],
                }}
                transition={{
                  duration: 3 + (i % 2),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
              >
                <svg width="24" height="20" viewBox="0 0 12 10">
                  {/* Bee body */}
                  <ellipse cx="6" cy="5" rx="4" ry="3" fill="#ffd700" />
                  <rect x="4" y="3" width="1" height="4" fill="#000" />
                  <rect x="7" y="3" width="1" height="4" fill="#000" />
                  
                  {/* Wings */}
                  <ellipse cx="4" cy="3" rx="3" ry="2" fill="white" opacity="0.7" />
                  <ellipse cx="8" cy="3" rx="3" ry="2" fill="white" opacity="0.7" />
                </svg>
              </motion.div>
            )}
          </div>
        ))}

        {/* Flock moves to the right only no loop */}
        {/* Birds - fixed pixel positions */}
        {[{ x: 0, y: 63 }, { x: 480, y: 90 }, { x: 960, y: 117 }].map((bird, i) => (
          <motion.div 
            key={i} 
            className="absolute z-5" 
            style={{ top: bird.y, left: bird.x }}
            animate={{ x: [0, 1440], y: [0, -12, 0, 10, 0] }}
            transition={{ 
              x: { duration: 8 + i * 2, ease: "linear", repeat: 0 },
              y: { duration: 2.5 + i * 0.6, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <svg width="30" height="15" viewBox="0 0 30 15">
              <path d="M0 8 Q7 0 15 8 Q23 0 30 8" fill="none" stroke="#2a2520" strokeWidth="2" />
            </svg>
          </motion.div>
        ))}
        
        {/* Flock container - moves left to right and loops */}
        <motion.div
          className="absolute z-5"
          style={{ top: 72 }}
          animate={{ x: [-30, 1440] }}
          transition={{ duration: 18, ease: "linear", repeat: Infinity }}
        >
          {/* Bird 1 - lead */}
          <motion.div
            className="absolute"
            style={{ left: '0px', top: '0px' }}
            animate={{ y: [0, -10, 0, 8, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
>
<svg width="30" height="15" viewBox="0 0 30 15">
<path d="M0 8 Q7 0 15 8 Q23 0 30 8" fill="none" stroke="
#2a2520" strokeWidth="2" />
</svg>
</motion.div>
  {/* Bird 2 - slightly behind and below */}
<motion.div
className="absolute"
style={{ left: '-22px', top: '12px' }}
animate={{ y: [0, -8, 0, 10, 0] }}
transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
>
<svg width="30" height="15" viewBox="0 0 30 15">
<path d="M0 8 Q7 0 15 8 Q23 0 30 8" fill="none" stroke="
#2a2520" strokeWidth="2" />
</svg>
</motion.div>
  {/* Bird 3 - slightly behind and above */}
<motion.div
className="absolute"
style={{ left: '-18px', top: '-10px' }}
animate={{ y: [0, -12, 0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
          >
            <svg width="30" height="15" viewBox="0 0 30 15">
              <path d="M0 8 Q7 0 15 8 Q23 0 30 8" fill="none" stroke="#2a2520" strokeWidth="2" />
            </svg>
          </motion.div>
        </motion.div>
</div>
      
      {/* Title */}
      <div className="absolute z-10" style={{ top: 36, left: 720, transform: "translateX(-50%)" }}>
        
      </div>

      {/* Easel with Canvas */}
      <div className="absolute" style={{ top: 174, left: 720, transform: "translateX(-50%)" }}>
        {/* Easel legs */}
        <svg className="absolute -bottom-12 left-1/2 -translate-x-1/2" width="300" height="60" viewBox="0 0 300 60">
          <line x1="40" y1="0" x2="15" y2="60" stroke="#8b4513" strokeWidth="10" />
          <line x1="260" y1="0" x2="285" y2="60" stroke="#8b4513" strokeWidth="10" />
          <line x1="150" y1="0" x2="150" y2="60" stroke="#8b4513" strokeWidth="10" />
          <line x1="50" y1="40" x2="250" y2="40" stroke="#8b4513" strokeWidth="7" />
        </svg>
        
        {/* Canvas frame */}
        <div className="bg-[#8b4513] p-4 border-4 border-[#8b4513] shadow-xl relative">
          <div className="bg-[#8b4513] p-2">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={600}
                height={380}
                onMouseDown={handleMouseDown}
                onMouseMove={draw}
                onMouseUp={() => setIsDrawing(false)}
                onMouseLeave={() => setIsDrawing(false)}
className="border-4 border-[#8b4513]"
                style={{ imageRendering: "pixelated", width: "600px", height: "380px" }}
              />
              
              {/* Revealed skills - fixed positions based on zones */}
              {skillZones.map((zone) => (
                revealedSkills[zone.id] && (
                  <motion.div
                    key={zone.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute pointer-events-none"
                    style={{ 
                      left: zone.zone.x + zone.zone.w / 2 - 50, 
                      top: zone.zone.y + zone.zone.h / 2 - 10 
                    }}
                  >
                    <span 
  className="font-[var(--font-pixel)] text-black text-3xl font-bold px-4 py-2 bg-white/80 "
>
                      {zone.skills}
                    </span>
                  </motion.div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>

   {/* RECTANGULAR Color Palette - 2 rows x 3 columns */}
<div className="absolute bottom-14 left-1/2 -translate-x-1/2">
  <div className="relative">
    {/* Rectangular wooden palette */}
    <svg width="370" height="80" viewBox="0 0 370 80">
      
      {/* Main body - solid color matching canvas wood */}
      <rect x="0" y="0" width="370" height="80" rx="0" fill="#8b4513" />
      
    </svg>

    {/* Color circles - 2 rows x 3 cols with padding from edges */}
    <div className="absolute inset-0 flex items-center justify-center px-6">
      <div className="flex flex-row gap-4">
        {skillZones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => { playClick(); setSelectedColor(zone.id); }}
            className="w-11 h-11 rounded-full transition-all"
            style={{ 
              backgroundColor: zone.color,
              boxShadow: selectedColor === zone.id
                ? `inset -3px -3px 6px rgba(0,0,0,0.3), inset 3px 3px 6px rgba(255,255,255,0.2), 0 0 10px 3px ${zone.color}`
                : `inset -3px -3px 6px rgba(0,0,0,0.3), inset 3px 3px 6px rgba(255,255,255,0.2)`,
            }}
            title={zone.skills}
          />
        ))}
      </div>
    </div>
  </div>
</div>
</motion.div> 
)
}
// ============ ABOUT SCENE - Modern Room with City View ============
function AboutScene({ aboutData, playClick }: { aboutData: any, playClick: () => void }) {
  const [showBrowser, setShowBrowser] = useState(false)
  const [activeTab, setActiveTab] = useState<"background" | "hobbies" | "goals">("background")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
   useEffect(() => {
    if (!showBrowser) {
      setIsLoggedIn(false)
    }
  }, [showBrowser])
  const handleLogin = () => {
    playClick()
    setIsLoggedIn(true)
    setTimeout(() => setShowBrowser(true), 500)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full relative overflow-hidden"
      style={{ width: 1440, height: 900 }}
    >
      {/* Room background */}
      <div className="absolute inset-0" style={{ imageRendering: "pixelated" }}>
        {/* Gradient wall - warmer tones */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#e8dcc4] via-[#d4c4a8] to-[#c4b498]" style={{ height: 450 }}>
          <svg className="absolute inset-0 w-full h-full opacity-25">
            <defs>
              <pattern id="wallTex" patternUnits="userSpaceOnUse" width="50" height="50">
                <rect width="48" height="48" fill="none" stroke="#b8a888" strokeWidth="1" x="1" y="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wallTex)" />
          </svg>
        </div>

        {/* LARGE Window with NIGHT CITYSCAPE */}
        <div className="absolute" style={{ top: 45, right: 43 }}>
          <svg width="280" height="220" viewBox="0 0 280 220">
            {/* Window frame */}
            <rect x="0" y="0" width="280" height="220" fill="#5c4033" />
            
            {/* Night sky with gradient */}
            <defs>
              <linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0a0a1e" />
                <stop offset="50%" stopColor="#1a1a3e" />
                <stop offset="100%" stopColor="#2a2a4e" />
              </linearGradient>
              
              {/* Glow effect for moon */}
              <radialGradient id="moonGlow">
                <stop offset="0%" stopColor="#fffef0" />
                <stop offset="50%" stopColor="#f0e68c" />
                <stop offset="100%" stopColor="#0a0a1e" stopOpacity="0" />
              </radialGradient>
              
              {/* Clip path for window content */}
              <clipPath id="windowClip">
                <rect x="8" y="8" width="264" height="204" />
              </clipPath>
            </defs>
            
            {/* Everything inside this group will be clipped by the window panes */}
            <g clipPath="url(#windowClip)">
              <rect x="8" y="8" width="264" height="204" fill="url(#nightSky)" />
              
              {/* Twinkling stars */}
              {[...Array(25)].map((_, i) => (
                <motion.circle 
                  key={i} 
                  cx={15 + (i * 13) % 250} 
                  cy={15 + (i * 17) % 85} 
                  r={0.8 + (i % 3) * 0.5} 
                  fill="#fff"
                  animate={{ 
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.3, 1]
                  }}
                  transition={{ 
                    duration: 2 + (i % 4), 
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              {/* Moon with glow */}
              <circle cx="228" cy="40" r="28" fill="url(#moonGlow)" opacity="0.4" />
              <circle cx="228" cy="40" r="18" fill="#f0e68c" />
              <circle cx="228" cy="40" r="15" fill="#fffef0" />
              
              {/* Moon craters */}
              <circle cx="223" cy="38" r="3" fill="#e6d67a" opacity="0.5" />
              <circle cx="232" cy="43" r="2" fill="#e6d67a" opacity="0.5" />
              <circle cx="226" cy="45" r="1.5" fill="#e6d67a" opacity="0.5" />
              
              {/* City buildings silhouettes with depth */}
              <rect x="15" y="100" width="35" height="112" fill="#0f0f1a" />
              <rect x="55" y="130" width="28" height="82" fill="#1a1a2e" />
              <rect x="88" y="85" width="40" height="127" fill="#0f0f1a" />
              <rect x="133" y="110" width="32" height="102" fill="#1a1a2e" />
              <rect x="170" y="70" width="45" height="142" fill="#0f0f1a" />
              <rect x="220" y="120" width="38" height="92" fill="#1a1a2e" />
              
              {/* Animated lit windows - flickering effect */}
              {[...Array(60)].map((_, i) => {
                const buildings = [
                  { x: 20, y: 108, w: 25, h: 104, cols: 3, rows: 10 },
                  { x: 60, y: 138, w: 18, h: 74, cols: 2, rows: 7 },
                  { x: 95, y: 92, w: 28, h: 120, cols: 3, rows: 12 },
                  { x: 138, y: 118, w: 22, h: 94, cols: 2, rows: 9 },
                  { x: 178, y: 78, w: 30, h: 134, cols: 3, rows: 13 },
                  { x: 228, y: 128, w: 22, h: 84, cols: 2, rows: 8 },
                ]
                const buildingIndex = i % 6
                const b = buildings[buildingIndex]
                const windowIndex = Math.floor(i / 6)
                const col = windowIndex % b.cols
                const row = Math.floor(windowIndex / b.cols)
                
                if (row >= b.rows) return null
                
                const isLit = Math.random() > 0.25
                
                return (
                  <motion.rect 
                    key={i} 
                    x={b.x + col * 8} 
                    y={b.y + row * 10} 
                    width="5" 
                    height="7" 
                    fill={isLit ? "#ffd700" : "#2a2a3e"}
                    initial={{ opacity: isLit ? 0.8 : 0.1 }}
                    animate={{ 
                      opacity: isLit ? [0.6, 0.9, 0.7, 0.85, 0.6] : 0.1
                    }}
                    transition={{ 
                      duration: 3 + Math.random() * 2, 
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  />
                )
              })}
              
              {/* Animated plane flying across - INSIDE CLIP PATH */}
              <motion.g
                animate={{ x: [280, -50] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              >
                <circle cx="0" cy="45" r="1" fill="#ff6b6b" />
                <line x1="-8" y1="45" x2="8" y2="45" stroke="#cccccc" strokeWidth="1.5" />
                <polygon points="0,42 8,45 0,48" fill="#cccccc" />
                <motion.circle 
                  cx="0" 
                  cy="45" 
                  r="1.5" 
                  fill="#ff0000"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </motion.g>
              
              {/* Light pollution glow at bottom */}
              <rect x="8" y="170" width="264" height="42" fill="url(#nightSky)" opacity="0.3" />
              <rect x="8" y="180" width="264" height="32" fill="#4a3a1a" opacity="0.15" />
            </g>
            
            {/* Window dividers - OUTSIDE clip path so they're on top */}
            <line x1="140" y1="8" x2="140" y2="212" stroke="#5c4033" strokeWidth="6" />
            <line x1="8" y1="110" x2="272" y2="110" stroke="#5c4033" strokeWidth="6" />
          </svg>
        </div>

        {/* Wooden floor with richer texture */}
        <div className="absolute bottom-0 left-0 right-0 h-[51.1%] bg-gradient-to-b from-[#6b4c35] to-[#5c4033]">
          <svg className="absolute inset-0 w-full h-full opacity-35">
            <defs>
              <pattern id="woodFloor" patternUnits="userSpaceOnUse" width="120" height="30">
                <rect width="118" height="28" fill="#7b5c45" stroke="#4a3020" strokeWidth="2" />
                <line x1="40" y1="0" x2="40" y2="30" stroke="#4a3020" strokeWidth="1" opacity="0.5" />
                <line x1="80" y1="0" x2="80" y2="30" stroke="#4a3020" strokeWidth="1" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#woodFloor)" />
          </svg>
        </div>

        {/* CENTERED DESKTOP SETUP - Modern white desk with sleek metal legs */}
        <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2">
          {/* Modern Desk with Metal Legs */}
<svg width="420" height="100" viewBox="0 0 420 100" style={{ overflow: 'visible' }}>
  {/* Left leg - sleek gunmetal grey with subtle gradient */}
  <defs>
    <linearGradient id="metalLeg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#4a4a4a" />
      <stop offset="50%" stopColor="#5a5a5a" />
      <stop offset="100%" stopColor="#4a4a4a" />
    </linearGradient>
  </defs>

  {/* Left leg */}
  <rect x="25" y="30" width="8" height="70" fill="url(#metalLeg)" rx="2" stroke="none" />

  {/* Right leg */}
  <rect x="387" y="30" width="8" height="70" fill="url(#metalLeg)" rx="2" stroke="none" />
            
            {/* Desktop surface - clean white */}
            <path d="M 30 0 L 390 0 L 420 48 L 0 48 Z" fill="#ffffff" />
            
            {/* Keyboard on desk - positioned with gap from monitor base */}
            <g transform="translate(120, 14)">
              {/* Keyboard base */}
              <rect x="0" y="0" width="140" height="28" fill="#2a2a2a" rx="3" />
              
              {/* Key rows */}
              {/* Top row */}
              {[...Array(12)].map((_, i) => (
                <rect key={`top-${i}`} x={6 + i * 11} y="5" width="9" height="6" fill="#1a1a1a" rx="1" />
              ))}
              
              {/* Middle row */}
              {[...Array(11)].map((_, i) => (
                <rect key={`mid-${i}`} x={9 + i * 11} y="12" width="9" height="6" fill="#1a1a1a" rx="1" />
              ))}
              
              {/* Bottom row */}
              {[...Array(9)].map((_, i) => (
                <rect key={`bot-${i}`} x={14 + i * 11} y="19" width="9" height="6" fill="#1a1a1a" rx="1" />
              ))}
              
              {/* Spacebar */}
              <rect x="42" y="26" width="56" height="4" fill="#1a1a1a" rx="1" />
            </g>
            
            {/* Mouse on desk - right side with gap from edge */}
            <g transform="translate(270, 8)">
              {/* Mouse body */}
              <ellipse cx="12" cy="18" rx="12" ry="18" fill="#2a2a2a" />
              <ellipse cx="12" cy="18" rx="12" ry="18" fill="none" stroke="#3a3a3a" strokeWidth="1" />
              
              {/* Mouse buttons divider */}
              <line x1="12" y1="2" x2="12" y2="18" stroke="#1a1a1a" strokeWidth="1" />
              
              {/* Scroll wheel */}
              <rect x="9.5" y="6" width="5" height="9" fill="#1a1a1a" rx="1.5" />
              
              {/* Highlight */}
              <ellipse cx="8" cy="15" rx="2.5" ry="6" fill="#3a3a3a" opacity="0.5" />
            </g>
          </svg>

          {/* Monitor - Black screen with white silhouette and login */}
          <div className="absolute -top-[180px] left-1/2 -translate-x-1/2">
            <svg 
              width="280" 
              height="200" 
              viewBox="0 0 280 200" 
              style={{ cursor: isLoggedIn ? 'default' : 'pointer' }}
              onClick={!isLoggedIn ? handleLogin : undefined}
            >
              {/* Monitor frame - dark grey */}
              <rect className="text-black" x="8" y="0" width="264" height="165" fill="#2a2a2a" rx="8" />
              
              {/* Screen bezel */}
              {/* Screen content - BLACK background */}
              <rect x="16" y="8" width="248" height="149" fill="#2a2a2a" />
              
              {/* White Anonymous user silhouette */}
              <circle cx="140" cy="50" r="12" fill="#ffffff" />
              <ellipse cx="140" cy="78" rx="18" ry="12" fill="#ffffff" />
              
              {/* White Login button */}
              {!isLoggedIn && (
                <g style={{ cursor: 'pointer' }}>
                  <text x="140" y="132" textAnchor="middle" fill="#ffffff" fontSize="14" fontFamily="monospace" fontWeight="bold">Log In</text>
                </g>
              )}
              
              {isLoggedIn && (
                <text x="140" y="132" textAnchor="middle" fill="#ffffff" fontSize="14" fontFamily="monospace" fontWeight="bold">Welcome</text>
              )}
              
              {/* Monitor Stand - silver/grey */}
              <rect x="115" y="165" width="50" height="14" fill="#2a2a2a" />
              <rect x="100" y="179" width="80" height="10" fill="#2a2a2a" rx="3" />
            </svg>
          </div>
        </div>

        {/* Coffee mug with steam on desk - FIXED POSITION */}
        <div className="absolute" style={{ bottom: 428, right: 535 }}>
          <svg width="50" height="60" viewBox="0 0 50 60">
            {/* Steam animation */}
            {[0, 1, 2].map((i) => (
              <motion.path
                key={i}
                d={`M ${20 + i * 5} 5 Q ${22 + i * 5} 0 ${20 + i * 5} -5`}
                fill="none"
                stroke="#d0d0d0"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
                animate={{
                  d: [
                    `M ${20 + i * 5} 5 Q ${22 + i * 5} 0 ${20 + i * 5} -5`,
                    `M ${20 + i * 5} 5 Q ${18 + i * 5} 0 ${20 + i * 5} -5`,
                    `M ${20 + i * 5} 5 Q ${22 + i * 5} 0 ${20 + i * 5} -5`,
                  ],
                  opacity: [0, 0.6, 0],
                  y: [0, -15, -30],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeOut"
                }}
              />
            ))}
            
            {/* Mug */}
            <rect x="15" y="20" width="20" height="25" fill="#d62839" rx="2" />
            
            {/* Handle */}
            <path d="M 32 27 Q 37 30 40 35 Q 37 38 35 43" fill="none" stroke="#d62839" strokeWidth="3" />
            
            {/* Coffee surface */}
            <ellipse cx="25" cy="22" rx="8" ry="2" fill="#3a2520" />
          </svg>
        </div>

        {/* Gaming Chair */}
        <div className="absolute" style={{ bottom: 190, left: 720, transform: "translateX(-50%)" }}>
          <svg width="198" height="252" viewBox="0 0 110 140" style={{ imageRendering: "pixelated" }}>
            <rect x="16" y="0" width="78" height="76" fill="#2a2a2a" rx="5" />
            <rect x="22" y="6" width="66" height="64" fill="#3a3a3a" rx="4" />
            <rect x="12" y="72" width="86" height="26" fill="#2a2a2a" rx="4" />
            <rect x="0" y="58" width="16" height="36" fill="#2a2a2a" rx="3" />
            <rect x="94" y="58" width="16" height="36" fill="#2a2a2a" rx="3" />
            <rect x="35" y="98" width="40" height="7" fill="#2a2a2a" />
            <ellipse cx="55" cy="110" rx="35" ry="9" fill="#2a2a2a" />
            <ellipse cx="35" cy="130" rx="11" ry="7" fill="#3a3a3a" />
            <ellipse cx="75" cy="130" rx="11" ry="7" fill="#3a3a3a" />
          </svg>
        </div>

        {/* Floating shelf with items */}
        <div className="absolute" style={{ top: 90, left: 58 }}>
          <svg width="300" height="130" viewBox="0 0 150 65">
            <rect x="0" y="42" width="150" height="9" fill="#6b4c35" />
            
            {/* Books with improved detail */}
            {/* Book 1 - Red */}
            <rect x="8" y="10" width="12" height="32" fill="#e63946" />
            <rect x="8" y="10" width="12" height="3" fill="#d62839" />
            <rect x="8" y="39" width="12" height="3" fill="#b81f2e" />
            <line x1="14" y1="10" x2="14" y2="42" stroke="#ffffff" strokeWidth="0.3" opacity="0.3" />
            <rect x="9" y="20" width="10" height="1" fill="#ffffff" opacity="0.2" />
            
            {/* Book 2 - Blue */}
            <rect x="23" y="14" width="10" height="28" fill="#457b9d" />
            <rect x="23" y="14" width="10" height="2.5" fill="#5a8db0" />
            <rect x="23" y="39.5" width="10" height="2.5" fill="#356a87" />
            <line x1="28" y1="14" x2="28" y2="42" stroke="#ffffff" strokeWidth="0.3" opacity="0.3" />
            <rect x="24" y="26" width="8" height="1" fill="#ffffff" opacity="0.2" />
            
            {/* Book 3 - Green */}
            <rect x="36" y="8" width="14" height="34" fill="#2a9d8f" />
            <rect x="36" y="8" width="14" height="3" fill="#3cb3a3" />
            <rect x="36" y="39" width="14" height="3" fill="#1f7a6f" />
            <line x1="43" y1="8" x2="43" y2="42" stroke="#ffffff" strokeWidth="0.3" opacity="0.3" />
            <rect x="37" y="22" width="12" height="1.5" fill="#ffffff" opacity="0.2" />
            
            {/* Small plant with texture */}
            <g>
              {/* Plant pot with texture */}
              <defs>
                <pattern id="potTexture" patternUnits="userSpaceOnUse" width="4" height="4">
                  <rect width="4" height="4" fill="#5c4033" />
                  <circle cx="2" cy="2" r="0.5" fill="#4a3329" opacity="0.6" />
                </pattern>
                <radialGradient id="potGradient" cx="50%" cy="30%">
                  <stop offset="0%" stopColor="#6d4d3d" />
                  <stop offset="100%" stopColor="#4a3329" />
                </radialGradient>
              </defs>
              
              {/* Pot base */}
              <rect x="95" y="26" width="20" height="16" fill="url(#potGradient)" />
              <rect x="95" y="26" width="20" height="12" fill="url(#potTexture)" opacity="0.4" />
              
              {/* Pot rim highlight */}
              {/* Soil */}
              {/* Leaves with texture and depth */}
              {/* Leaf highlights and details */}
              <ellipse cx="102" cy="18" rx="6" ry="4" fill="#2ea02e" opacity="0.8" />
              <ellipse cx="108" cy="19" rx="5" ry="3" fill="#2ea02e" opacity="0.7" />
              <ellipse cx="105" cy="22" rx="7" ry="4" fill="#1e6b1e" opacity="0.6" />
              
              {/* Individual leaves for texture */}
              <ellipse cx="98" cy="20" rx="4" ry="6" fill="#228b22" opacity="0.9" transform="rotate(-25 98 20)" />
              <ellipse cx="112" cy="20" rx="4" ry="6" fill="#228b22" opacity="0.9" transform="rotate(25 112 20)" />
              <ellipse cx="105" cy="15" rx="4" ry="5" fill="#2ea02e" opacity="0.95" />
              
              {/* Leaf veins */}
              <line x1="105" y1="15" x2="105" y2="22" stroke="#1a5c1a" strokeWidth="0.5" opacity="0.4" />
              <line x1="98" y1="18" x2="102" y2="21" stroke="#1a5c1a" strokeWidth="0.3" opacity="0.3" />
              <line x1="112" y1="18" x2="108" y2="21" stroke="#1a5c1a" strokeWidth="0.3" opacity="0.3" />
            </g>
          </svg>
        </div>
      </div>

      {/* Title */}
      <div className="absolute z-10" style={{ top: 45, left: 720, transform: "translateX(-50%)" }}>
      </div>

      {/* Safari Browser popup - Authentic Safari Dark Mode - CENTERED */}
      <AnimatePresence>
        {showBrowser && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowBrowser(false)} 
              className="absolute inset-0 bg-black/70 z-40" 
            />
            
            <motion.div
              initial={{ scale: 0.3, opacity: 0, y: 100, x: "-50%" }}
              animate={{ scale: 1, opacity: 1, y: "-50%", x: "-50%" }}
              exit={{ scale: 0.3, opacity: 0, y: 100, x: "-50%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute z-50"
              style={{ top: 450, left: 720, width: 720 }}
            >
              <div className="bg-[#28282a] rounded-xl overflow-hidden shadow-2xl border border-[#3d3d3f]" style={{ imageRendering: "auto" }}>
                {/* Safari Tab Bar - Lighter grey with pill tabs */}
                <div className="bg-[#38383a] px-3 pt-2 pb-0">
                  {/* Window controls + Tabs row */}
                  <div className="flex items-center gap-3">
                    {/* Traffic lights */}
                    <div className="flex items-center gap-2 px-1">
                      <button 
                        onClick={() => { playClick(); setShowBrowser(false); }} 
                        className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all" 
                      />
                      <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                      <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                    </div>
                    
                    {/* Safari-style pill tabs */}
                    <div className="flex items-end gap-0.5 flex-1">
                      {(["background", "hobbies", "goals"] as const).map((tab) => (
                        <button 
                          key={tab} 
                          onClick={() => { playClick(); setActiveTab(tab); }}
                          className={`relative py-2 text-[13px] font-medium transition-colors rounded-t-lg text-center ${
                            activeTab === tab 
                              ? "bg-[#28282a] text-[#ffffff]" 
                              : "bg-[#48484a] text-[#98989d] hover:bg-[#505052] hover:text-[#c0c0c2]"
                          }`}
                          style={{
                            width: '120px',
                            borderTopLeftRadius: '8px',
                            borderTopRightRadius: '8px',
                          }}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* URL bar */}
                
                {/* Content Area - Fixed height so popup doesn't move */}
                <div className="bg-[#28282a] p-6 h-[450px] overflow-y-auto scrollbar-hide">                  <AnimatePresence mode="wait">
                    {/* BACKGROUND TAB - Enhanced Timeline with hover effects */}
{activeTab === "background" && (
  <div>
    {/* Enhanced Timeline */}
    <div className="relative pl-8 space-y-7 mb-8">
      {/* Solid blue bar with glow effect - starts at center of first dot, ends at center of last */}
      <div 
        className="absolute left-[2px] top-[60px] w-1 rounded-full bg-[#0a84ff]"
        style={{
          height: 'calc(100% - 120px)',
          boxShadow: '0 0 10px rgba(10, 132, 255, 0.5), 0 0 20px rgba(10, 132, 255, 0.3)'
        }}
      />
      
      {[
        { 
          year: "2029", 
          title: "Mumbai University", 
          desc: "BTech in Computer Science + Cyber Security"
        },
        { 
          year: "2025", 
          title: "ALLEN", 
          desc: "Advanced Coaching and Preparation"
        },
        { 
          year: "2023", 
          title: "AVM", 
          desc: "ICSE - Secondary Education"
        },
      ].map((item, i) => (
        <div 
          key={i}
          className="relative"
        >
          {/* Blue timeline dot with glow - no border */}
          <div 
            className="absolute -left-[38px] top-13 w-5 h-5 rounded-full bg-[#0a84ff]"
            style={{ 
              boxShadow: '0 0 20px rgba(10, 132, 255, 0.5), 0 0 10px rgba(10, 132, 255, 0.3)'
            }}
          />
          
          {/* Content card with hover effects */}
          <div className="bg-[#2c2c2e] rounded-lg p-4 border border-[#3d3d3f] hover:border-[#4d4d4f] transition-all hover:scale-101 cursor-pointer group">
            <div className="flex items-center gap-2 mb-2">
              <span 
                className="text-base font-semibold px-2 py-0.5 rounded-full bg-[#0a84ff20] text-[#0a84ff] transition-all relative overflow-visible group-hover:shadow-[0_0_20px_rgba(10,132,255,0.6)]"
              >
                <span className="relative">{item.year}</span>
              </span>
            </div>
            <h4 className="text-[#ffffff] text-sm font-semibold mb-1">{item.title}</h4>
            <p className="text-[#98989d] text-sm leading-relaxed">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
    
    {/* Enhanced Fun Fact section */}
  </div>
)}

{/* HOBBIES TAB - Enhanced Cards (removed AnimatePresence wrapper) */}
{activeTab === "hobbies" && (
  <div>
    <div className="grid grid-cols-3 gap-4">
      {[
        { 
          icon: "♟", 
          title: "Chess", 
          desc: "I want to cross 2000 elo one day", 
          color: "#bf5af2",
          gradient: "from-[#bf5af220] to-[#bf5af205]"
        },
        { 
          icon: "📚", 
          title: "Reading", 
          desc: "I like reading books about science and history", 
          color: "#0a84ff",
          gradient: "from-[#0a84ff20] to-[#0a84ff05]"
        },
        { 
          icon: "🎹", 
          title: "Music", 
          desc: "SOAD is my favourite band", 
          color: "#ff375f",
          gradient: "from-[#ff375f20] to-[#ff375f05]"
        },
        { 
          icon: "🏓", 
          title: "Table Tennis", 
          desc: "I want to improve my forehand play", 
          color: "#32d74b",
          gradient: "from-[#32d74b20] to-[#32d74b05]"
        },
        { 
          icon: "🎨", 
          title: "Art", 
          desc: "I enjoy making digital comics", 
          color: "#ff9f0a",
          gradient: "from-[#ff9f0a20] to-[#ff9f0a05]"
        },
        { 
          icon: "🎭", 
          title: "Acting", 
          desc: "I've done a few ads and movies", 
          color: "#ffd60a",
          gradient: "from-[#ffd60a20] to-[#ffd60a05]"
        },
      ].map((hobby, i) => (
        <div 
          key={i}
          className={`bg-gradient-to-br ${hobby.gradient} rounded-xl p-4 border border-[#3d3d3f] hover:border-[#4d4d4f] transition-all hover:scale-103 cursor-pointer relative overflow-hidden group`}
        >
          {/* Hover glow effect */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"
            style={{ background: `radial-gradient(circle at center, ${hobby.color}40, transparent)` }}
          />
          
          <div className="relative z-10">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3 text-2xl"
              style={{ backgroundColor: `${hobby.color}15` }}
            >
              {hobby.icon}
            </div>
            <h4 className="text-[#ffffff] text-sm font-semibold mb-1.5" style={{ color: hobby.color }}>
              {hobby.title}
            </h4>
            <p className="text-[#98989d] text-sm leading-relaxed">
              {hobby.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

{/* GOALS TAB - Enhanced List with circular glow effects and better alignment */}
{activeTab === "goals" && (
  <div>
    <div className="space-y-4">
      {[
        { 
          text: "I want to be a good pentester", 
          color: "#bf5af2",
          gradient: "from-[#bf5af240] to-[#bf5af210]"
        },
        { 
          text: "I want to be able to do automatic bug testing and fixing", 
          color: "#0a84ff",
          gradient: "from-[#0a84ff40] to-[#0a84ff10]"
        },
        { 
          text: "I want to get better at my hobbies", 
          color: "#32d74b",
          gradient: "from-[#32d74b40] to-[#32d74b10]"
        },
      ].map((goal, i) => (
        <div 
          key={i}
          className="flex items-center gap-4 p-4 bg-[#2c2c2e] rounded-xl border border-[#3d3d3f] hover:border-[#4d4d4f] transition-all group hover:scale-101 cursor-pointer"
        >
          {/* Styled number badge with gradient background and circular glow */}
          <div 
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${goal.gradient} flex-shrink-0 flex items-center justify-center text-lg font-bold relative transition-all border border-[#3d3d3f]`}
            style={{
              boxShadow: '0 0 0px rgba(0, 0, 0, 0)'
            }}
          >
            {/* Apply glow directly via inline style on hover */}
            <style>{`
              .group:hover .goal-number-${i} {
                box-shadow: 0 0 25px ${goal.color}80, 0 0 15px ${goal.color}60 !important;
              }
            `}</style>
            
            <div className={`absolute inset-0 rounded-full goal-number-${i}`} style={{ transition: 'box-shadow 0.3s' }} />
            
            {/* Number */}
            <span className="relative z-10" style={{ color: goal.color }}>
              {i + 1}
            </span>
          </div>
          
          {/* Goal text - centered vertically */}
          <p className="text-[#ffffff] text-sm leading-relaxed flex-1">
            {goal.text}
          </p>
        </div>
      ))}
    </div>
  </div>
)}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
