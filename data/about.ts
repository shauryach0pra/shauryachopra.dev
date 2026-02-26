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

export const aboutData: AboutData = {
  personal: {
    name: "Shaurya Chopra",
    email: "shauryachopra@zohomail.in",
    phone: "+91 9137887901",
    linkedin: "https://www.linkedin.com/in/shaurya-chopra-1a1922379/",
    github: "https://github.com/shauryach0pra",
    university: "Mumbai University",
    degree: "BTech CS + Cyber Security",
    tagline: "Exploring AI Engineering & Cyber Security"
  },
  background: {
    education: [
      "10th from AVM Juhu",
      "11th & 12th from Allen",
      "Currently BTech CS + Cyber Security at Mumbai University"
    ],
    childhood: "Did advertisements and movies as a kid",
    current: "Currently exploring AI Engineering & Cybersecurity"
  },
  interests: [
    "Playing table tennis",
    "Playing chess",
    "Playing the piano"
  ],
  goals: {
    career: "Wants to become a highly skilled penetration tester",
    passion: "Passionate about cybersecurity",
    learning: "Continuously learning and improving skills"
  }
}
