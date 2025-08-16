"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProtectedRoute } from "@/components/auth-provider"
import { useCreateTheme, useDeleteTheme, useAllThemes, useUpdateTheme } from "@/hooks/use-theme"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Palette } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminContent />
    </ProtectedRoute>
  )
}

function AdminContent() {
  const [newThemeName, setNewThemeName] = useState('')
  const [newThemeLabel, setNewThemeLabel] = useState('')
  
  const { data: themes, isLoading } = useAllThemes()
  const createTheme = useCreateTheme()
  const deleteTheme = useDeleteTheme()

  const handleCreateTheme = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newThemeName || !newThemeLabel) return

    try {
      await createTheme.mutateAsync({
        name: newThemeName,
        label: newThemeLabel,
        colors: {
          light: {
            background: "oklch(1 0 0)",
            foreground: "oklch(0.145 0 0)",
            primary: "oklch(0.55 0.25 " + (Math.random() * 360) + ")",
            "primary-foreground": "oklch(0.98 0.01 0)",
          },
          dark: {
            background: "oklch(0.145 0 0)",
            foreground: "oklch(0.985 0 0)",
            primary: "oklch(0.65 0.25 " + (Math.random() * 360) + ")",
            "primary-foreground": "oklch(0.08 0.03 0)",
          },
        },
      })
      
      setNewThemeName('')
      setNewThemeLabel('')
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleDeleteTheme = (themeName: string) => {
    if (window.confirm(`Are you sure you want to delete "${themeName}"?`)) {
      deleteTheme.mutate(themeName)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Palette className="h-6 w-6" />
              Admin Dashboard
            </h1>
            <Link href="/">
              <Button variant="outline">← Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create New Theme */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Theme
            </h2>
            
            <form onSubmit={handleCreateTheme} className="space-y-4">
              <div>
                <Label htmlFor="theme-name">Theme Name</Label>
                <Input
                  id="theme-name"
                  value={newThemeName}
                  onChange={(e) => setNewThemeName(e.target.value)}
                  placeholder="e.g., emerald"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="theme-label">Display Label</Label>
                <Input
                  id="theme-label"
                  value={newThemeLabel}
                  onChange={(e) => setNewThemeLabel(e.target.value)}
                  placeholder="e.g., Emerald Green"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={createTheme.isPending}
                className="w-full"
              >
                {createTheme.isPending ? 'Creating...' : 'Create Theme'}
              </Button>
            </form>
          </Card>

          {/* Manage Existing Themes */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Manage Themes</h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {Array.isArray(themes) && themes.length > 0 ? themes.map((theme) => (
                  <div key={theme.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {Object.values(theme.colors.light).slice(0, 3).map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div>
                        <div className="font-medium">{theme.label}</div>
                        <div className="text-sm text-muted-foreground">{theme.name}</div>
                      </div>
                      {theme.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                    
                    {!theme.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTheme(theme.name)}
                        disabled={deleteTheme.isPending}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )) : (
                  <p className="text-muted-foreground text-center py-4">
                    {themes === undefined ? 'Loading themes...' : 'No themes available'}
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Admin Features */}
        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Admin Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">🎨 Theme Management</h3>
                <p className="text-muted-foreground">Create, update, and delete custom themes</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">👥 User Management</h3>
                <p className="text-muted-foreground">View and manage user accounts (coming soon)</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">📊 Analytics</h3>
                <p className="text-muted-foreground">Theme usage statistics (coming soon)</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
