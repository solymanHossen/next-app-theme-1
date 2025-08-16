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
 
      },
      dark: {
     
      },
    },
    isDefault: true,
  },

 
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
          // Find theme from API data or fallback
          const allThemes = get().isOnlineMode ? [] : fallbackThemes // This will be populated by the hook
          const currentTheme = allThemes.find(t => t.name === theme) || fallbackThemes.find(t => t.name === theme)
          
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

  // Handle API errors
  useEffect(() => {
    if (themesError || activeError) {
      store.setOnlineMode(false)
      store.clearError()
    }
  }, [themesError, activeError])

  // Enhanced setTheme that syncs with API
  const setTheme = async (theme: string) => {
    store.setTheme(theme)
    
    if (store.isOnlineMode) {
      try {
        await setActiveThemeMutation.mutateAsync({ theme, isDark: store.isDark })
      } catch (error) {
        console.warn('Failed to sync theme with API:', error)
        // Continue with local theme change
      }
    }
  }

  // Enhanced toggleDarkMode that syncs with API
  const toggleDarkMode = async () => {
    const newIsDark = !store.isDark
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

  // Get available themes (API + fallback)
  const availableThemes = store.isOnlineMode && apiThemes?.length ? apiThemes : fallbackThemes

  // Apply theme on mount and when dependencies change
  useEffect(() => {
    store.applyTheme()
  }, [store.theme, store.isDark])

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
    applyTheme: store.applyTheme,
    setOnlineMode: store.setOnlineMode,
    clearError: store.clearError,
  }
}
