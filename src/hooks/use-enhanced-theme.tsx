"use client"

import React, { useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useActiveTheme, useSetActiveTheme, useThemes } from './use-theme-api'
import { Theme } from '@/lib/theme-api-client'

// Local theme definitions (fallback when API is unavailable)
const fallbackThemes: Theme[] = [
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
    isDefault: true,
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
        ring: "oklch(0.65 0.25 40)",
      },
    },
  }
]

interface ThemeState {
  theme: string
  isDark: boolean
  isLoading: boolean
  error: string | null
  isOnlineMode: boolean
}

interface ThemeActions {
  setTheme: (theme: string) => void
  toggleDarkMode: () => void
  setOnlineMode: (online: boolean) => void
  applyTheme: () => void
  clearError: () => void
}

type ThemeStore = ThemeState & ThemeActions

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: "default",
      isDark: false,
      isLoading: false,
      error: null,
      isOnlineMode: true,

      // Actions
      setTheme: (newTheme: string) => {
        set({ theme: newTheme })
        get().applyTheme()
      },

      toggleDarkMode: () => {
        set(state => ({ isDark: !state.isDark }))
        get().applyTheme()
      },

      setOnlineMode: (online: boolean) => {
        set({ isOnlineMode: online })
      },

      clearError: () => {
        set({ error: null })
      },

      applyTheme: () => {
        const { theme, isDark } = get()
        
        if (typeof document !== 'undefined') {
          // Note: This will be enhanced by the hook to use actual theme data
          const currentTheme = fallbackThemes.find(t => t.name === theme) || fallbackThemes[0]
          
          if (currentTheme) {
            const colors = isDark ? currentTheme.colors.dark : currentTheme.colors.light
            const root = document.documentElement
            
            // Apply CSS custom properties with better performance
            requestAnimationFrame(() => {
              Object.entries(colors).forEach(([key, value]) => {
                root.style.setProperty(`--${key}`, value)
              })

              // Set data attributes for CSS selectors
              root.setAttribute('data-theme', theme)
              root.setAttribute('data-mode', isDark ? 'dark' : 'light')
              
              // Add/remove dark class for compatibility
              root.classList.toggle('dark', isDark)
              
              // Add theme transition class for smooth changes
              root.classList.add('theme-transition')
              
              // Remove transition class after animation completes
              setTimeout(() => {
                root.classList.remove('theme-transition')
              }, 300)
            })
          }
        }
      },
    }),
    {
      name: 'enhanced-theme-store',
      partialize: (state) => ({
        theme: state.theme,
        isDark: state.isDark,
        isOnlineMode: state.isOnlineMode,
      }),
    }
  )
)

// Enhanced theme hook with API integration
export const useTheme = () => {
  const store = useThemeStore()
  
  // API hooks
  const { data: apiThemes, isLoading: themesLoading, error: themesError } = useThemes()
  const { data: activeTheme, isLoading: activeLoading, error: activeError } = useActiveTheme()
  const setActiveThemeMutation = useSetActiveTheme()

  // Sync with API active theme on mount
  useEffect(() => {
    if (activeTheme && store.isOnlineMode) {
      if (activeTheme.theme !== store.theme || activeTheme.isDark !== store.isDark) {
        store.setTheme(activeTheme.theme)
        if (activeTheme.isDark !== store.isDark) {
          store.toggleDarkMode()
        }
      }
    }
  }, [activeTheme, store.isOnlineMode])

  // Handle API errors gracefully
  useEffect(() => {
    if (themesError || activeError) {
      console.warn('API Theme Error:', { themesError, activeError })
      store.setOnlineMode(false)
      store.clearError()
    }
  }, [themesError, activeError])

  // Enhanced setTheme that syncs with API
  const setTheme = async (theme: string) => {
    // Apply theme immediately for instant UI feedback
    store.setTheme(theme)
    
    if (store.isOnlineMode) {
      try {
        await setActiveThemeMutation.mutateAsync({ theme, isDark: store.isDark })
      } catch (error) {
        console.warn('Failed to sync theme with API:', error)
        // Continue with local theme change - graceful degradation
      }
    }
  }

  // Enhanced toggleDarkMode that syncs with API
  const toggleDarkMode = async () => {
    const newIsDark = !store.isDark
    // Apply immediately for instant feedback
    store.toggleDarkMode()
    
    if (store.isOnlineMode) {
      try {
        await setActiveThemeMutation.mutateAsync({ theme: store.theme, isDark: newIsDark })
      } catch (error) {
        console.warn('Failed to sync dark mode with API:', error)
        // Continue with local dark mode change
      }
    }
  }

  // Get available themes (API + fallback) with proper merging
  const availableThemes = React.useMemo(() => {
    if (store.isOnlineMode && apiThemes?.length) {
      // Merge API themes with fallback themes, API themes take precedence
      const apiThemeNames = new Set(apiThemes.map(t => t.name))
      const uniqueFallbackThemes = fallbackThemes.filter(t => !apiThemeNames.has(t.name))
      return [...apiThemes, ...uniqueFallbackThemes]
    }
    return fallbackThemes
  }, [store.isOnlineMode, apiThemes])

  // Enhanced applyTheme that uses actual theme data
  const applyTheme = React.useCallback(() => {
    if (typeof document !== 'undefined') {
      const currentTheme = availableThemes.find(t => t.name === store.theme) || availableThemes[0]
      
      if (currentTheme) {
        const colors = store.isDark ? currentTheme.colors.dark : currentTheme.colors.light
        const root = document.documentElement
        
        // Apply CSS custom properties with better performance
        requestAnimationFrame(() => {
          Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(`--${key}`, value)
          })

          // Set data attributes for CSS selectors
          root.setAttribute('data-theme', store.theme)
          root.setAttribute('data-mode', store.isDark ? 'dark' : 'light')
          
          // Add/remove dark class for compatibility
          root.classList.toggle('dark', store.isDark)
          
          // Add theme transition class for smooth changes
          root.classList.add('theme-transition')
          
          // Remove transition class after animation completes
          setTimeout(() => {
            root.classList.remove('theme-transition')
          }, 300)
        })
      }
    }
  }, [availableThemes, store.theme, store.isDark])

  // Apply theme on mount and when dependencies change
  useEffect(() => {
    applyTheme()
  }, [applyTheme])

  return {
    // State
    theme: store.theme,
    isDark: store.isDark,
    themes: availableThemes,
    isLoading: store.isLoading || themesLoading || activeLoading || setActiveThemeMutation.isPending,
    error: store.error || themesError?.message || activeError?.message || setActiveThemeMutation.error?.message,
    isOnlineMode: store.isOnlineMode,
    
    // Actions
    setTheme,
    toggleDarkMode,
    applyTheme,
    setOnlineMode: store.setOnlineMode,
    clearError: store.clearError,
    
    // Additional utilities
    getCurrentTheme: () => availableThemes.find(t => t.name === store.theme),
    isSystemTheme: () => store.theme === 'default',
  }
}
