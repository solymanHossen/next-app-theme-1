"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { themeApiClient, Theme, ActiveTheme, ThemeApiError } from '@/lib/theme-api-client'
import { toast } from 'sonner' // You might want to install sonner for notifications

// Query keys
export const THEME_KEYS = {
  all: ['themes'] as const,
  lists: () => [...THEME_KEYS.all, 'list'] as const,
  list: (filters: string) => [...THEME_KEYS.lists(), { filters }] as const,
  details: () => [...THEME_KEYS.all, 'detail'] as const,
  detail: (name: string) => [...THEME_KEYS.details(), name] as const,
  active: () => [...THEME_KEYS.all, 'active'] as const,
}

// Hooks for fetching themes
export function useThemes() {
  return useQuery({
    queryKey: THEME_KEYS.lists(),
    queryFn: () => themeApiClient.getAllThemes(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useTheme(name: string) {
  return useQuery({
    queryKey: THEME_KEYS.detail(name),
    queryFn: () => themeApiClient.getThemeByName(name),
    enabled: !!name,
  })
}

export function useActiveTheme() {
  return useQuery({
    queryKey: THEME_KEYS.active(),
    queryFn: () => themeApiClient.getActiveTheme(),
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Mutation hooks for theme management
export function useCreateTheme() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (theme: Omit<Theme, 'createdAt' | 'updatedAt'>) => 
      themeApiClient.createTheme(theme),
    onSuccess: (newTheme) => {
      // Invalidate and refetch themes
      queryClient.invalidateQueries({ queryKey: THEME_KEYS.lists() })
      
      // Add the new theme to the cache
      queryClient.setQueryData(THEME_KEYS.detail(newTheme.name), newTheme)
      
      toast?.success?.('Theme created successfully!')
    },
    onError: (error: ThemeApiError) => {
      toast?.error?.(error.message || 'Failed to create theme')
    },
  })
}

export function useUpdateTheme() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, updates }: { name: string; updates: Partial<Theme> }) =>
      themeApiClient.updateTheme(name, updates),
    onSuccess: (updatedTheme, { name }) => {
      // Update the theme in cache
      queryClient.setQueryData(THEME_KEYS.detail(name), updatedTheme)
      
      // Invalidate themes list to reflect changes
      queryClient.invalidateQueries({ queryKey: THEME_KEYS.lists() })
      
      toast?.success?.('Theme updated successfully!')
    },
    onError: (error: ThemeApiError) => {
      toast?.error?.(error.message || 'Failed to update theme')
    },
  })
}

export function useDeleteTheme() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => themeApiClient.deleteTheme(name),
    onSuccess: (_, name) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: THEME_KEYS.detail(name) })
      
      // Invalidate themes list
      queryClient.invalidateQueries({ queryKey: THEME_KEYS.lists() })
      
      toast?.success?.('Theme deleted successfully!')
    },
    onError: (error: ThemeApiError) => {
      toast?.error?.(error.message || 'Failed to delete theme')
    },
  })
}

export function useSetActiveTheme() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ theme, isDark }: { theme: string; isDark: boolean }) =>
      themeApiClient.setActiveTheme(theme, isDark),
    onSuccess: (_, { theme, isDark }) => {
      // Update active theme in cache
      queryClient.setQueryData(THEME_KEYS.active(), { theme, isDark })
      
      toast?.success?.('Theme applied successfully!')
    },
    onError: (error: ThemeApiError) => {
      toast?.error?.(error.message || 'Failed to apply theme')
    },
  })
}

// Authentication hooks
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      themeApiClient.login(credentials),
    onSuccess: (data) => {
      // Clear all queries and refetch with new authentication
      queryClient.clear()
      
      toast?.success?.(`Welcome back, ${data.user.name}!`)
    },
    onError: (error: ThemeApiError) => {
      toast?.error?.(error.message || 'Login failed')
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      themeApiClient.logout()
      return Promise.resolve()
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear()
      
      toast?.success?.('Logged out successfully')
    },
  })
}

// Helper hooks
export function useIsAuthenticated() {
  return themeApiClient.isAuthenticated()
}

export function useIsAdmin() {
  return themeApiClient.isAdmin()
}

export function useCurrentUser() {
  return themeApiClient.getCurrentUser()
}
