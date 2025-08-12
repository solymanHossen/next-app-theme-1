"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = {
  name: string
  label: string
  colors: {
    light: Record<string, string>
    dark: Record<string, string>
  }
}

const themes: Theme[] = [
  {
    name: "default",
    label: "Default",
    colors: {
      light: {
        background: "oklch(1 0 0)",
        foreground: "oklch(0.145 0 0)",
        primary: "oklch(0.205 0 0)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "oklch(0.97 0 0)",
        "secondary-foreground": "oklch(0.205 0 0)",
        accent: "oklch(0.97 0 0)",
        "accent-foreground": "oklch(0.205 0 0)",
        muted: "oklch(0.97 0 0)",
        "muted-foreground": "oklch(0.556 0 0)",
        card: "oklch(1 0 0)",
        "card-foreground": "oklch(0.145 0 0)",
        border: "oklch(0.922 0 0)",
        input: "oklch(0.922 0 0)",
        ring: "oklch(0.708 0 0)",
      },
      dark: {
        background: "oklch(0.145 0 0)",
        foreground: "oklch(0.985 0 0)",
        primary: "oklch(0.985 0 0)",
        "primary-foreground": "oklch(0.205 0 0)",
        secondary: "oklch(0.269 0 0)",
        "secondary-foreground": "oklch(0.985 0 0)",
        accent: "oklch(0.269 0 0)",
        "accent-foreground": "oklch(0.985 0 0)",
        muted: "oklch(0.269 0 0)",
        "muted-foreground": "oklch(0.708 0 0)",
        card: "oklch(0.145 0 0)",
        "card-foreground": "oklch(0.985 0 0)",
        border: "oklch(0.269 0 0)",
        input: "oklch(0.269 0 0)",
        ring: "oklch(0.439 0 0)",
      },
    },
  },
  {
    name: "ocean",
    label: "Ocean Blue",
    colors: {
      light: {
        background: "oklch(0.98 0.01 220)",
        foreground: "oklch(0.15 0.05 220)",
        primary: "oklch(0.55 0.25 220)",
        "primary-foreground": "oklch(0.98 0.01 220)",
        secondary: "oklch(0.94 0.03 220)",
        "secondary-foreground": "oklch(0.15 0.05 220)",
        accent: "oklch(0.88 0.08 200)",
        "accent-foreground": "oklch(0.15 0.05 220)",
        muted: "oklch(0.94 0.03 220)",
        "muted-foreground": "oklch(0.45 0.08 220)",
        card: "oklch(0.99 0.005 220)",
        "card-foreground": "oklch(0.15 0.05 220)",
        border: "oklch(0.88 0.05 220)",
        input: "oklch(0.88 0.05 220)",
        ring: "oklch(0.55 0.25 220)",
      },
      dark: {
        background: "oklch(0.08 0.03 220)",
        foreground: "oklch(0.95 0.02 220)",
        primary: "oklch(0.65 0.25 220)",
        "primary-foreground": "oklch(0.08 0.03 220)",
        secondary: "oklch(0.15 0.05 220)",
        "secondary-foreground": "oklch(0.95 0.02 220)",
        accent: "oklch(0.25 0.08 200)",
        "accent-foreground": "oklch(0.95 0.02 220)",
        muted: "oklch(0.15 0.05 220)",
        "muted-foreground": "oklch(0.65 0.08 220)",
        card: "oklch(0.12 0.04 220)",
        "card-foreground": "oklch(0.95 0.02 220)",
        border: "oklch(0.25 0.08 220)",
        input: "oklch(0.25 0.08 220)",
        ring: "oklch(0.65 0.25 220)",
      },
    },
  },
  {
    name: "forest",
    label: "Forest Green",
    colors: {
      light: {
        background: "oklch(0.98 0.01 140)",
        foreground: "oklch(0.15 0.05 140)",
        primary: "oklch(0.45 0.20 140)",
        "primary-foreground": "oklch(0.98 0.01 140)",
        secondary: "oklch(0.94 0.03 140)",
        "secondary-foreground": "oklch(0.15 0.05 140)",
        accent: "oklch(0.85 0.08 120)",
        "accent-foreground": "oklch(0.15 0.05 140)",
        muted: "oklch(0.94 0.03 140)",
        "muted-foreground": "oklch(0.45 0.08 140)",
        card: "oklch(0.99 0.005 140)",
        "card-foreground": "oklch(0.15 0.05 140)",
        border: "oklch(0.88 0.05 140)",
        input: "oklch(0.88 0.05 140)",
        ring: "oklch(0.45 0.20 140)",
      },
      dark: {
        background: "oklch(0.08 0.03 140)",
        foreground: "oklch(0.95 0.02 140)",
        primary: "oklch(0.65 0.20 140)",
        "primary-foreground": "oklch(0.08 0.03 140)",
        secondary: "oklch(0.15 0.05 140)",
        "secondary-foreground": "oklch(0.95 0.02 140)",
        accent: "oklch(0.25 0.08 120)",
        "accent-foreground": "oklch(0.95 0.02 140)",
        muted: "oklch(0.15 0.05 140)",
        "muted-foreground": "oklch(0.65 0.08 140)",
        card: "oklch(0.12 0.04 140)",
        "card-foreground": "oklch(0.95 0.02 140)",
        border: "oklch(0.25 0.08 140)",
        input: "oklch(0.25 0.08 140)",
        ring: "oklch(0.65 0.20 140)",
      },
    },
  },
  {
    name: "sunset",
    label: "Sunset Orange",
    colors: {
      light: {
        background: "oklch(0.98 0.01 40)",
        foreground: "oklch(0.15 0.05 40)",
        primary: "oklch(0.65 0.25 40)",
        "primary-foreground": "oklch(0.98 0.01 40)",
        secondary: "oklch(0.94 0.03 40)",
        "secondary-foreground": "oklch(0.15 0.05 40)",
        accent: "oklch(0.88 0.08 20)",
        "accent-foreground": "oklch(0.15 0.05 40)",
        muted: "oklch(0.94 0.03 40)",
        "muted-foreground": "oklch(0.45 0.08 40)",
        card: "oklch(0.99 0.005 40)",
        "card-foreground": "oklch(0.15 0.05 40)",
        border: "oklch(0.88 0.05 40)",
        input: "oklch(0.88 0.05 40)",
        ring: "oklch(0.65 0.25 40)",
      },
      dark: {
        background: "oklch(0.08 0.03 40)",
        foreground: "oklch(0.95 0.02 40)",
        primary: "oklch(0.75 0.25 40)",
        "primary-foreground": "oklch(0.08 0.03 40)",
        secondary: "oklch(0.15 0.05 40)",
        "secondary-foreground": "oklch(0.95 0.02 40)",
        accent: "oklch(0.25 0.08 20)",
        "accent-foreground": "oklch(0.95 0.02 40)",
        muted: "oklch(0.15 0.05 40)",
        "muted-foreground": "oklch(0.65 0.08 40)",
        card: "oklch(0.12 0.04 40)",
        "card-foreground": "oklch(0.95 0.02 40)",
        border: "oklch(0.25 0.08 40)",
        input: "oklch(0.25 0.08 40)",
        ring: "oklch(0.75 0.25 40)",
      },
    },
  },
  {
    name: "lavender",
    label: "Lavender Purple",
    colors: {
      light: {
        background: "oklch(0.98 0.01 280)",
        foreground: "oklch(0.15 0.05 280)",
        primary: "oklch(0.55 0.20 280)",
        "primary-foreground": "oklch(0.98 0.01 280)",
        secondary: "oklch(0.94 0.03 280)",
        "secondary-foreground": "oklch(0.15 0.05 280)",
        accent: "oklch(0.88 0.08 300)",
        "accent-foreground": "oklch(0.15 0.05 280)",
        muted: "oklch(0.94 0.03 280)",
        "muted-foreground": "oklch(0.45 0.08 280)",
        card: "oklch(0.99 0.005 280)",
        "card-foreground": "oklch(0.15 0.05 280)",
        border: "oklch(0.88 0.05 280)",
        input: "oklch(0.88 0.05 280)",
        ring: "oklch(0.55 0.20 280)",
      },
      dark: {
        background: "oklch(0.08 0.03 280)",
        foreground: "oklch(0.95 0.02 280)",
        primary: "oklch(0.65 0.20 280)",
        "primary-foreground": "oklch(0.08 0.03 280)",
        secondary: "oklch(0.15 0.05 280)",
        "secondary-foreground": "oklch(0.95 0.02 280)",
        accent: "oklch(0.25 0.08 300)",
        "accent-foreground": "oklch(0.95 0.02 280)",
        muted: "oklch(0.15 0.05 280)",
        "muted-foreground": "oklch(0.65 0.08 280)",
        card: "oklch(0.12 0.04 280)",
        "card-foreground": "oklch(0.95 0.02 280)",
        border: "oklch(0.25 0.08 280)",
        input: "oklch(0.25 0.08 280)",
        ring: "oklch(0.65 0.20 280)",
      },
    },
  },
  {
    name: "rose",
    label: "Rose Pink",
    colors: {
      light: {
        background: "oklch(0.98 0.01 350)",
        foreground: "oklch(0.15 0.05 350)",
        primary: "oklch(0.65 0.25 350)",
        "primary-foreground": "oklch(0.98 0.01 350)",
        secondary: "oklch(0.94 0.03 350)",
        "secondary-foreground": "oklch(0.15 0.05 350)",
        accent: "oklch(0.88 0.08 330)",
        "accent-foreground": "oklch(0.15 0.05 350)",
        muted: "oklch(0.94 0.03 350)",
        "muted-foreground": "oklch(0.45 0.08 350)",
        card: "oklch(0.99 0.005 350)",
        "card-foreground": "oklch(0.15 0.05 350)",
        border: "oklch(0.88 0.05 350)",
        input: "oklch(0.88 0.05 350)",
        ring: "oklch(0.65 0.25 350)",
      },
      dark: {
        background: "oklch(0.08 0.03 350)",
        foreground: "oklch(0.95 0.02 350)",
        primary: "oklch(0.75 0.25 350)",
        "primary-foreground": "oklch(0.08 0.03 350)",
        secondary: "oklch(0.15 0.05 350)",
        "secondary-foreground": "oklch(0.95 0.02 350)",
        accent: "oklch(0.25 0.08 330)",
        "accent-foreground": "oklch(0.95 0.02 350)",
        muted: "oklch(0.15 0.05 350)",
        "muted-foreground": "oklch(0.65 0.08 350)",
        card: "oklch(0.12 0.04 350)",
        "card-foreground": "oklch(0.95 0.02 350)",
        border: "oklch(0.25 0.08 350)",
        input: "oklch(0.25 0.08 350)",
        ring: "oklch(0.75 0.25 350)",
      },
    },
  },
  {
    name: "amber",
    label: "Amber Gold",
    colors: {
      light: {
        background: "oklch(0.98 0.01 80)",
        foreground: "oklch(0.15 0.05 80)",
        primary: "oklch(0.70 0.20 80)",
        "primary-foreground": "oklch(0.15 0.05 80)",
        secondary: "oklch(0.94 0.03 80)",
        "secondary-foreground": "oklch(0.15 0.05 80)",
        accent: "oklch(0.88 0.08 60)",
        "accent-foreground": "oklch(0.15 0.05 80)",
        muted: "oklch(0.94 0.03 80)",
        "muted-foreground": "oklch(0.45 0.08 80)",
        card: "oklch(0.99 0.005 80)",
        "card-foreground": "oklch(0.15 0.05 80)",
        border: "oklch(0.88 0.05 80)",
        input: "oklch(0.88 0.05 80)",
        ring: "oklch(0.70 0.20 80)",
      },
      dark: {
        background: "oklch(0.08 0.03 80)",
        foreground: "oklch(0.95 0.02 80)",
        primary: "oklch(0.80 0.20 80)",
        "primary-foreground": "oklch(0.08 0.03 80)",
        secondary: "oklch(0.15 0.05 80)",
        "secondary-foreground": "oklch(0.95 0.02 80)",
        accent: "oklch(0.25 0.08 60)",
        "accent-foreground": "oklch(0.95 0.02 80)",
        muted: "oklch(0.15 0.05 80)",
        "muted-foreground": "oklch(0.65 0.08 80)",
        card: "oklch(0.12 0.04 80)",
        "card-foreground": "oklch(0.95 0.02 80)",
        border: "oklch(0.25 0.08 80)",
        input: "oklch(0.25 0.08 80)",
        ring: "oklch(0.80 0.20 80)",
      },
    },
  },
  {
    name: "teal",
    label: "Teal Mint",
    colors: {
      light: {
        background: "oklch(0.98 0.01 180)",
        foreground: "oklch(0.15 0.05 180)",
        primary: "oklch(0.50 0.20 180)",
        "primary-foreground": "oklch(0.98 0.01 180)",
        secondary: "oklch(0.94 0.03 180)",
        "secondary-foreground": "oklch(0.15 0.05 180)",
        accent: "oklch(0.88 0.08 160)",
        "accent-foreground": "oklch(0.15 0.05 180)",
        muted: "oklch(0.94 0.03 180)",
        "muted-foreground": "oklch(0.45 0.08 180)",
        card: "oklch(0.99 0.005 180)",
        "card-foreground": "oklch(0.15 0.05 180)",
        border: "oklch(0.88 0.05 180)",
        input: "oklch(0.88 0.05 180)",
        ring: "oklch(0.50 0.20 180)",
      },
      dark: {
        background: "oklch(0.08 0.03 180)",
        foreground: "oklch(0.95 0.02 180)",
        primary: "oklch(0.60 0.20 180)",
        "primary-foreground": "oklch(0.08 0.03 180)",
        secondary: "oklch(0.15 0.05 180)",
        "secondary-foreground": "oklch(0.95 0.02 180)",
        accent: "oklch(0.25 0.08 160)",
        "accent-foreground": "oklch(0.95 0.02 180)",
        muted: "oklch(0.15 0.05 180)",
        "muted-foreground": "oklch(0.65 0.08 180)",
        card: "oklch(0.12 0.04 180)",
        "card-foreground": "oklch(0.95 0.02 180)",
        border: "oklch(0.25 0.08 180)",
        input: "oklch(0.25 0.08 180)",
        ring: "oklch(0.60 0.20 180)",
      },
    },
  },
  {
    name: "crimson",
    label: "Crimson Red",
    colors: {
      light: {
        background: "oklch(0.98 0.01 10)",
        foreground: "oklch(0.15 0.05 10)",
        primary: "oklch(0.55 0.25 10)",
        "primary-foreground": "oklch(0.98 0.01 10)",
        secondary: "oklch(0.94 0.03 10)",
        "secondary-foreground": "oklch(0.15 0.05 10)",
        accent: "oklch(0.88 0.08 350)",
        "accent-foreground": "oklch(0.15 0.05 10)",
        muted: "oklch(0.94 0.03 10)",
        "muted-foreground": "oklch(0.45 0.08 10)",
        card: "oklch(0.99 0.005 10)",
        "card-foreground": "oklch(0.15 0.05 10)",
        border: "oklch(0.88 0.05 10)",
        input: "oklch(0.88 0.05 10)",
        ring: "oklch(0.55 0.25 10)",
      },
      dark: {
        background: "oklch(0.08 0.03 10)",
        foreground: "oklch(0.95 0.02 10)",
        primary: "oklch(0.65 0.25 10)",
        "primary-foreground": "oklch(0.08 0.03 10)",
        secondary: "oklch(0.15 0.05 10)",
        "secondary-foreground": "oklch(0.95 0.02 10)",
        accent: "oklch(0.25 0.08 350)",
        "accent-foreground": "oklch(0.95 0.02 10)",
        muted: "oklch(0.15 0.05 10)",
        "muted-foreground": "oklch(0.65 0.08 10)",
        card: "oklch(0.12 0.04 10)",
        "card-foreground": "oklch(0.95 0.02 10)",
        border: "oklch(0.25 0.08 10)",
        input: "oklch(0.25 0.08 10)",
        ring: "oklch(0.65 0.25 10)",
      },
    },
  },
  {
    name: "indigo",
    label: "Indigo Blue",
    colors: {
      light: {
        background: "oklch(0.98 0.01 260)",
        foreground: "oklch(0.15 0.05 260)",
        primary: "oklch(0.50 0.25 260)",
        "primary-foreground": "oklch(0.98 0.01 260)",
        secondary: "oklch(0.94 0.03 260)",
        "secondary-foreground": "oklch(0.15 0.05 260)",
        accent: "oklch(0.88 0.08 240)",
        "accent-foreground": "oklch(0.15 0.05 260)",
        muted: "oklch(0.94 0.03 260)",
        "muted-foreground": "oklch(0.45 0.08 260)",
        card: "oklch(0.99 0.005 260)",
        "card-foreground": "oklch(0.15 0.05 260)",
        border: "oklch(0.88 0.05 260)",
        input: "oklch(0.88 0.05 260)",
        ring: "oklch(0.50 0.25 260)",
      },
      dark: {
        background: "oklch(0.08 0.03 260)",
        foreground: "oklch(0.95 0.02 260)",
        primary: "oklch(0.60 0.25 260)",
        "primary-foreground": "oklch(0.08 0.03 260)",
        secondary: "oklch(0.15 0.05 260)",
        "secondary-foreground": "oklch(0.95 0.02 260)",
        accent: "oklch(0.25 0.08 240)",
        "accent-foreground": "oklch(0.95 0.02 260)",
        muted: "oklch(0.15 0.05 260)",
        "muted-foreground": "oklch(0.65 0.08 260)",
        card: "oklch(0.12 0.04 260)",
        "card-foreground": "oklch(0.95 0.02 260)",
        border: "oklch(0.25 0.08 260)",
        input: "oklch(0.25 0.08 260)",
        ring: "oklch(0.60 0.25 260)",
      },
    },
  },
  {
    name: "emerald",
    label: "Emerald Green",
    colors: {
      light: {
        background: "oklch(0.98 0.01 160)",
        foreground: "oklch(0.15 0.05 160)",
        primary: "oklch(0.50 0.22 160)",
        "primary-foreground": "oklch(0.98 0.01 160)",
        secondary: "oklch(0.94 0.03 160)",
        "secondary-foreground": "oklch(0.15 0.05 160)",
        accent: "oklch(0.88 0.08 140)",
        "accent-foreground": "oklch(0.15 0.05 160)",
        muted: "oklch(0.94 0.03 160)",
        "muted-foreground": "oklch(0.45 0.08 160)",
        card: "oklch(0.99 0.005 160)",
        "card-foreground": "oklch(0.15 0.05 160)",
        border: "oklch(0.88 0.05 160)",
        input: "oklch(0.88 0.05 160)",
        ring: "oklch(0.50 0.22 160)",
      },
      dark: {
        background: "oklch(0.08 0.03 160)",
        foreground: "oklch(0.95 0.02 160)",
        primary: "oklch(0.60 0.22 160)",
        "primary-foreground": "oklch(0.08 0.03 160)",
        secondary: "oklch(0.15 0.05 160)",
        "secondary-foreground": "oklch(0.95 0.02 160)",
        accent: "oklch(0.25 0.08 140)",
        "accent-foreground": "oklch(0.95 0.02 160)",
        muted: "oklch(0.15 0.05 160)",
        "muted-foreground": "oklch(0.65 0.08 160)",
        card: "oklch(0.12 0.04 160)",
        "card-foreground": "oklch(0.95 0.02 160)",
        border: "oklch(0.25 0.08 160)",
        input: "oklch(0.25 0.08 160)",
        ring: "oklch(0.60 0.22 160)",
      },
    },
  },
  {
    name: "slate",
    label: "Slate Gray",
    colors: {
      light: {
        background: "oklch(0.98 0.005 220)",
        foreground: "oklch(0.15 0.02 220)",
        primary: "oklch(0.35 0.08 220)",
        "primary-foreground": "oklch(0.98 0.005 220)",
        secondary: "oklch(0.94 0.02 220)",
        "secondary-foreground": "oklch(0.15 0.02 220)",
        accent: "oklch(0.88 0.04 220)",
        "accent-foreground": "oklch(0.15 0.02 220)",
        muted: "oklch(0.94 0.02 220)",
        "muted-foreground": "oklch(0.45 0.04 220)",
        card: "oklch(0.99 0.002 220)",
        "card-foreground": "oklch(0.15 0.02 220)",
        border: "oklch(0.88 0.03 220)",
        input: "oklch(0.88 0.03 220)",
        ring: "oklch(0.35 0.08 220)",
      },
      dark: {
        background: "oklch(0.08 0.02 220)",
        foreground: "oklch(0.95 0.01 220)",
        primary: "oklch(0.65 0.08 220)",
        "primary-foreground": "oklch(0.08 0.02 220)",
        secondary: "oklch(0.15 0.03 220)",
        "secondary-foreground": "oklch(0.95 0.01 220)",
        accent: "oklch(0.25 0.04 220)",
        "accent-foreground": "oklch(0.95 0.01 220)",
        muted: "oklch(0.15 0.03 220)",
        "muted-foreground": "oklch(0.65 0.04 220)",
        card: "oklch(0.12 0.025 220)",
        "card-foreground": "oklch(0.95 0.01 220)",
        border: "oklch(0.25 0.04 220)",
        input: "oklch(0.25 0.04 220)",
        ring: "oklch(0.65 0.08 220)",
      },
    },
  },
]

type ThemeProviderContext = {
  theme: string
  setTheme: (theme: string) => void
  isDark: boolean
  toggleDarkMode: () => void
  themes: Theme[]
}

const ThemeProviderContext = createContext<ThemeProviderContext | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "default",
  ...props
}: {
  children: React.ReactNode
  defaultTheme?: string
} & React.ComponentProps<"div">) {
  const [theme, setTheme] = useState<string>(defaultTheme)
  const [isDark, setIsDark] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Fetch active theme from backend on mount
  useEffect(() => {
    const fetchActiveTheme = async () => {
      try {
        const response = await fetch('/api/themes/active')
        if (response.ok) {
          const data = await response.json()
          setTheme(data.theme || defaultTheme)
          setIsDark(data.isDark || false)
        }
      } catch (error) {
        console.error('Error fetching active theme:', error)
        // Fallback to default theme
        setTheme(defaultTheme)
        setIsDark(false)
      } finally {
        setIsLoading(false)
      }
    }

    fetchActiveTheme()
  }, [defaultTheme])

  // Apply theme to DOM and save to backend
  useEffect(() => {
    if (isLoading) return

    const root = window.document.documentElement
    const currentTheme = themes.find((t) => t.name === theme)

    if (currentTheme) {
      const colors = isDark ? currentTheme.colors.dark : currentTheme.colors.light

      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value)
      })

      root.classList.toggle("dark", isDark)
    }

    // Save to backend
    const saveActiveTheme = async () => {
      try {
        await fetch('/api/themes/active', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ theme, isDark }),
        })
      } catch (error) {
        console.error('Error saving active theme:', error)
      }
    }

    saveActiveTheme()
  }, [theme, isDark, isLoading])

  const value = {
    theme,
    setTheme: (newTheme: string) => {
      setTheme(newTheme)
    },
    isDark,
    toggleDarkMode: () => {
      setIsDark(!isDark)
    },
    themes,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
