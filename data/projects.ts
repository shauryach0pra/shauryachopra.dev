interface Project {
  id: number
  name: string
  description: string
  techStack: string[]
  screenshots: string[]
  github: string
  liveDemo: string
}

export const projectsData: Project[] = [
  {
    id: 1,
    name: "OTP Phishing Simulator",
    description: "Simulates a realistic phishing environment using social engineering techniques to test the user's susceptibility without real world consequences",
    techStack: ["Next.js", "TypeScript", "React", "Tailwind CSS", "Lucide React", "Resend", ".is-a.dev"],
    screenshots: [],
    github: "",
    liveDemo: ""
  }
]
