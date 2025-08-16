"use client";

import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { themeApiClient } from '@/lib/theme-api-client';

// Simple theme types for the demo
export interface Theme {
  name: string;
  label: string;
  isDefault?: boolean;
  colors: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}

// Default themes
const defaultThemes: Theme[] = [
  {
    name: "default",
    label: "Default",
    isDefault: true,
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
        background: "oklch(0.98 0.01 60)",
        foreground: "oklch(0.15 0.05 60)",
        primary: "oklch(0.60 0.20 60)",
        "primary-foreground": "oklch(0.98 0.01 60)",
        secondary: "oklch(0.94 0.03 60)",
        "secondary-foreground": "oklch(0.15 0.05 60)",
        accent: "oklch(0.85 0.08 40)",
        "accent-foreground": "oklch(0.15 0.05 60)",
        muted: "oklch(0.94 0.03 60)",
        "muted-foreground": "oklch(0.45 0.08 60)",
        card: "oklch(0.99 0.005 60)",
        "card-foreground": "oklch(0.15 0.05 60)",
        border: "oklch(0.88 0.05 60)",
        input: "oklch(0.88 0.05 60)",
        ring: "oklch(0.60 0.20 60)",
      },
      dark: {
        background: "oklch(0.08 0.03 60)",
        foreground: "oklch(0.95 0.02 60)",
        primary: "oklch(0.70 0.20 60)",
        "primary-foreground": "oklch(0.08 0.03 60)",
        secondary: "oklch(0.15 0.05 60)",
        "secondary-foreground": "oklch(0.95 0.02 60)",
        accent: "oklch(0.25 0.08 40)",
        "accent-foreground": "oklch(0.95 0.02 60)",
        muted: "oklch(0.15 0.05 60)",
        "muted-foreground": "oklch(0.65 0.08 60)",
        card: "oklch(0.12 0.04 60)",
        "card-foreground": "oklch(0.95 0.02 60)",
        border: "oklch(0.25 0.08 60)",
        input: "oklch(0.25 0.08 60)",
        ring: "oklch(0.70 0.20 60)",
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
        primary: "oklch(0.55 0.18 280)",
        "primary-foreground": "oklch(0.98 0.01 280)",
        secondary: "oklch(0.94 0.03 280)",
        "secondary-foreground": "oklch(0.15 0.05 280)",
        accent: "oklch(0.88 0.06 300)",
        "accent-foreground": "oklch(0.15 0.05 280)",
        muted: "oklch(0.94 0.03 280)",
        "muted-foreground": "oklch(0.45 0.08 280)",
        card: "oklch(0.99 0.005 280)",
        "card-foreground": "oklch(0.15 0.05 280)",
        border: "oklch(0.88 0.05 280)",
        input: "oklch(0.88 0.05 280)",
        ring: "oklch(0.55 0.18 280)",
      },
      dark: {
        background: "oklch(0.08 0.03 280)",
        foreground: "oklch(0.95 0.02 280)",
        primary: "oklch(0.65 0.18 280)",
        "primary-foreground": "oklch(0.08 0.03 280)",
        secondary: "oklch(0.15 0.05 280)",
        "secondary-foreground": "oklch(0.95 0.02 280)",
        accent: "oklch(0.25 0.06 300)",
        "accent-foreground": "oklch(0.95 0.02 280)",
        muted: "oklch(0.15 0.05 280)",
        "muted-foreground": "oklch(0.65 0.08 280)",
        card: "oklch(0.12 0.04 280)",
        "card-foreground": "oklch(0.95 0.02 280)",
        border: "oklch(0.25 0.08 280)",
        input: "oklch(0.25 0.08 280)",
        ring: "oklch(0.65 0.18 280)",
      },
    },
  },
];

interface ThemeState {
  theme: string;
  isDark: boolean;
  themes: Theme[];
}

interface ThemeActions {
  setTheme: (theme: string) => void;
  toggleDarkMode: () => void;
  applyTheme: () => void;
}

type ThemeStore = ThemeState & ThemeActions;

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: "default",
      isDark: false,
      themes: defaultThemes,

      // Actions
      setTheme: (newTheme: string) => {
        set({ theme: newTheme });
        get().applyTheme();
      },

      toggleDarkMode: () => {
        set(state => ({ isDark: !state.isDark }));
        get().applyTheme();
      },

      applyTheme: () => {
        const { theme, isDark, themes } = get();
        const currentTheme = themes.find(t => t.name === theme);
        
        if (currentTheme && typeof document !== 'undefined') {
          const colors = isDark ? currentTheme.colors.dark : currentTheme.colors.light;
          const root = document.documentElement;
          
          // Apply CSS custom properties
          Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(`--${key}`, value);
          });

          // Set data attributes for CSS selectors
          root.setAttribute('data-theme', theme);
          root.setAttribute('data-mode', isDark ? 'dark' : 'light');
        }
      },
    }),
    {
      name: 'theme-store',
      partialize: (state) => ({
        theme: state.theme,
        isDark: state.isDark,
      }),
    }
  )
);

// Custom hook to fetch all themes from API
export const useAllThemes = () => {
  return useQuery({
    queryKey: ['themes'],
    queryFn: async () => {
      try {
        return await themeApiClient.getAllThemes();
      } catch (error) {
        console.error('Failed to fetch themes:', error);
        // Return default themes on error to prevent crashes
        return defaultThemes;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Custom hook to create a new theme
export const useCreateTheme = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: themeApiClient.createTheme,
    onSuccess: () => {
      // Invalidate and refetch themes
      queryClient.invalidateQueries({ queryKey: ['themes'] });
    },
  });
};

// Custom hook to update a theme
export const useUpdateTheme = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, theme }: { name: string; theme: any }) => 
      themeApiClient.updateTheme(name, theme),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themes'] });
    },
  });
};

// Custom hook to delete a theme
export const useDeleteTheme = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: themeApiClient.deleteTheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themes'] });
    },
  });
};

// Custom hook with automatic theme application
export const useTheme = () => {
  const store = useThemeStore();
  
  // Apply theme on mount and when dependencies change
  React.useEffect(() => {
    store.applyTheme();
  }, [store.theme, store.isDark]);

  return store;
};
