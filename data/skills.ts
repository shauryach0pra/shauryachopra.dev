// This file contains the data for the skills displayed in the interactive 'painting' scene.

interface SkillCategory {
  name: string
  color: string
  importance: number
  skills: string[]
}

export const skillsData: SkillCategory[] = [
  {
    name: "Backend Development",
    color: "violet",
    importance: 1,
    skills: ["Python", "Java"]
  },
  {
    name: "Cybersecurity",
    color: "indigo",
    importance: 2,
    skills: []
  },
  {
    name: "Frameworks",
    color: "blue",
    importance: 3,
    skills: []
  },
  {
    name: "Frontend Development",
    color: "green",
    importance: 4,
    skills: ["HTML", "CSS"]
  },
  {
    name: "Tools/DevOps",
    color: "yellow",
    importance: 5,
    skills: []
  },
  {
    name: "Databases",
    color: "orange",
    importance: 6,
    skills: []
  },
  {
    name: "AI/ML",
    color: "red",
    importance: 7,
    skills: []
  }
]
