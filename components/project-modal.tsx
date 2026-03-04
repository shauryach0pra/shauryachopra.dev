"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Github, ExternalLink } from "lucide-react"

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

// Define the props for the ProjectModal component
interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

/**
 * Renders a modal to display the details of a project.
 * @param {ProjectModalProps} props - The props for the component.
 * @returns {JSX.Element | null} The ProjectModal component, or null if no project is selected.
 */
export function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop for the modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 pixel-cursor"
          />
          
          {/* The modal itself */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-[600px] max-h-[80vh] overflow-y-auto"
          >
            {/* Pixel-art style frame for the modal */}
            <div className="bg-[#f5f2e8] border-4 border-[#2a2520] shadow-[8px_8px_0px_0px_#2a2520]">
              {/* Modal header with title and close button */}
              <div className="bg-[#2a2520] text-[#f5f2e8] px-4 py-2 flex items-center justify-between">
                <span className="font-[var(--font-pixel)] text-xs">
                  project.exe
                </span>
                <button
                  onClick={onClose}
                  className="hover:bg-[#f5f2e8]/20 p-1 transition-colors pixel-cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
              
              {/* Modal content */}
              <div className="p-6 space-y-6">
                {/* Project name */}
                <h2 className="font-[var(--font-pixel)] text-lg text-[#2a2520]">
                  {project.name}
                </h2>
                
                {/* Project description */}
                <p className="font-[var(--font-pixel-body)] text-lg text-[#2a2520]/80 leading-relaxed">
                  {project.description}
                </p>
                
                {/* Tech stack section */}
                <div className="space-y-2">
                  <h3 className="font-[var(--font-pixel)] text-xs text-[#2a2520]/60">
                    TECH STACK:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-[#2a2520]/10 border border-[#2a2520]/20 font-[var(--font-pixel-body)] text-sm text-[#2a2520]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Screenshots section (placeholder) */}
                {project.screenshots.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-[var(--font-pixel)] text-xs text-[#2a2520]/60">
                      SCREENSHOTS:
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {project.screenshots.map((screenshot, index) => (
                        <div
                          key={index}
                          className="aspect-video bg-[#2a2520]/10 border border-[#2a2520]/20 flex items-center justify-center"
                        >
                          <span className="text-xs text-[#2a2520]/40 font-[var(--font-pixel)]">
                            IMG {index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Links to GitHub and live demo */}
                <div className="flex gap-4 pt-4 border-t border-[#2a2520]/20">
                  {project.github ? (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#2a2520] text-[#f5f2e8] font-[var(--font-pixel)] text-xs hover:bg-[#2a2520]/80 transition-colors pixel-cursor-pointer"
                    >
                      <Github size={14} />
                      GitHub
                    </a>
                  ) : (
                    <span className="flex items-center gap-2 px-4 py-2 bg-[#2a2520]/30 text-[#f5f2e8] font-[var(--font-pixel)] text-xs cursor-not-allowed">
                      <Github size={14} />
                      Coming Soon
                    </span>
                  )}
                  
                  {project.liveDemo ? (
                    <a
                      href={project.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border-2 border-[#2a2520] text-[#2a2520] font-[var(--font-pixel)] text-xs hover:bg-[#2a2520]/10 transition-colors pixel-cursor-pointer"
                    >
                      <ExternalLink size={14} />
                      Live Demo
                    </a>
                  ) : (
                    <span className="flex items-center gap-2 px-4 py-2 border-2 border-[#2a2520]/30 text-[#2a2520]/50 font-[var(--font-pixel)] text-xs cursor-not-allowed">
                      <ExternalLink size={14} />
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
