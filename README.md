<div align="center">

### Personal Website

</div>

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](#)

</div>

---

### Overview

An interactive personal portfolio website featuring animated scenes, pixel-art aesthetics, and smooth transitions. The site showcases projects, skills, and about information through an engaging card-based interface with ambient sound effects and animations. Built with Next.js 16, React 19, and modern web animation libraries.

---

### Demo

Live Demo: [https://shauryachopra.dev](https://shauryachopra.dev)

---

### Project Structure

```
personal website/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main portfolio page with animations
├── components/             # Reusable UI components
├── data/                   # Portfolio data (skills, projects, about)
│   ├── about.ts
│   ├── projects.ts
│   └── skills.ts
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── public/                 # Static assets
└── styles/                 # Additional stylesheets
```

---

### Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Components**: Radix UI primitives
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Theming**: next-themes for dark mode support

---

### Installation

Install dependencies:

```bash
npm install
```

---

### Usage

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

Build for production:

```bash
npm run build
npm start
```

---

### Configuration

The project uses `legacy-peer-deps=true` in `.npmrc` to handle peer dependency conflicts with React 19.

---

<div align="center">

Built by [Shaurya Chopra](https://shauryachopra.dev/)

</div>
