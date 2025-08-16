"use client"

import { Moon, Sun, Palette, Plus, Edit, Trash2, Wifi, WifiOff, AlertCircle, LogIn, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/hooks/use-enhanced-theme"
import { useAuth, ProtectedRoute } from "@/components/auth-provider"
import { useCreateTheme, useDeleteTheme } from "@/hooks/use-theme-api"
import { useState } from "react"
import Link from "next/link"

export function ThemeSwitcher() {
  const { 
    theme, 
    isDark, 
    themes, 
    setTheme, 
    toggleDarkMode, 
    isLoading, 
    error, 
    isOnlineMode,
    setOnlineMode,
    clearError 
  } = useTheme()
  
  const { isAuthenticated, isAdmin, user } = useAuth()
  const [showCreateForm, setShowCreateForm] = useState(false)
  
  const deleteThemeMutation = useDeleteTheme()

  const handleDeleteTheme = async (themeName: string) => {
    if (window.confirm(`Are you sure you want to delete the "${themeName}" theme?`)) {
      try {
        await deleteThemeMutation.mutateAsync(themeName)
      } catch (error) {
        // Error is handled by the mutation
      }
    }
  }

  const currentTheme = themes.find(t => t.name === theme)

  return (
    <div className="flex items-center gap-2">
      {/* Connection Status */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {isOnlineMode ? (
          <div title="Online mode">
            <Wifi className="h-3 w-3 text-green-500" />
          </div>
        ) : (
          <div title="Offline mode">
            <WifiOff className="h-3 w-3 text-orange-500" />
          </div>
        )}
      </div>

      {/* Error Indicator */}
      {error && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearError}
          className="text-destructive"
        >
          <AlertCircle className="h-4 w-4" />
        </Button>
      )}

      {/* Theme Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isLoading}>
            <Palette className="h-4 w-4 mr-2" />
            {currentTheme?.label || "Theme"}
            {isLoading && (
              <div className="ml-2 animate-spin rounded-full h-3 w-3 border-b border-current"></div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          {/* Theme Options */}
          {themes.map((themeOption) => (
            <DropdownMenuItem
              key={themeOption.name}
              onClick={() => setTheme(themeOption.name)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Object.values(themeOption.colors.light).slice(0, 3).map((color, index) => (
                    <div
                      key={index}
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span>{themeOption.label}</span>
                {themeOption.isDefault && (
                  <Badge variant="secondary" className="text-xs">Default</Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                {theme === themeOption.name && (
                  <span className="text-xs">✓</span>
                )}
                
                {/* Admin Controls */}
                <ProtectedRoute adminOnly>
                  {!themeOption.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteTheme(themeOption.name)
                      }}
                      className="h-6 w-6 p-0 text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </ProtectedRoute>
              </div>
            </DropdownMenuItem>
          ))}

          {/* Admin Actions */}
          <ProtectedRoute adminOnly>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Theme
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <Settings className="h-4 w-4 mr-2" />
                Admin Dashboard
              </Link>
            </DropdownMenuItem>
          </ProtectedRoute>

          {/* Connection Toggle */}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOnlineMode(!isOnlineMode)}>
            {isOnlineMode ? (
              <>
                <WifiOff className="h-4 w-4 mr-2" />
                Switch to Offline Mode
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 mr-2" />
                Switch to Online Mode
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dark Mode Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleDarkMode}
        disabled={isLoading}
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      {/* User Info / Login */}
      {isAuthenticated && user ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{user.name}</span>
          {isAdmin && <Badge variant="secondary" className="text-xs">Admin</Badge>}
        </div>
      ) : (
        <Link href="/login">
          <Button variant="outline" size="sm">
            <LogIn className="h-4 w-4 mr-2" />
            Login
          </Button>
        </Link>
      )}
    </div>
  )
}

// Simple Create Theme Form Component
function CreateThemeForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [label, setLabel] = useState('')
  const createThemeMutation = useCreateTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createThemeMutation.mutateAsync({
        name,
        label,
        colors: {
          light: {
            background: "oklch(1 0 0)",
            foreground: "oklch(0.145 0 0)",
            primary: "oklch(0.205 0 0)",
          },
          dark: {
            background: "oklch(0.145 0 0)",
            foreground: "oklch(0.985 0 0)",
            primary: "oklch(0.985 0 0)",
          },
        },
      })
      onClose()
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg border max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Create New Theme</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Theme Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Display Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={createThemeMutation.isPending}>
              {createThemeMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
