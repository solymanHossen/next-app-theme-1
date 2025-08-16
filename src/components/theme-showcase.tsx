"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/hooks/use-enhanced-theme"
import { Palette, Monitor, Moon, Sun } from "lucide-react"

export function ThemeShowcase() {
  const { theme, themes, isDark, getCurrentTheme, isLoading, error } = useTheme()
  const currentTheme = getCurrentTheme()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
        <div className="text-center">
          <Palette className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Unable to load themes</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Palette className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Dynamic Theme System</h1>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Monitor className="h-4 w-4" />
          <span>Currently using:</span>
          <Badge variant="secondary" className="gap-1">
            {isDark ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
            {currentTheme?.label} {isDark ? 'Dark' : 'Light'}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground">
          {themes.length} themes available • Real-time API sync • Instant switching
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Primary Colors</CardTitle>
            <CardDescription>Main brand colors and accents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">Primary Button</Button>
            <Button variant="secondary" className="w-full">
              Secondary Button
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Outline Button
            </Button>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded bg-primary border border-border" title="Primary" />
              <div className="w-8 h-8 rounded bg-secondary border border-border" title="Secondary" />
              <div className="w-8 h-8 rounded bg-accent border border-border" title="Accent" />
              <div className="w-8 h-8 rounded bg-muted border border-border" title="Muted" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
            <CardDescription>Input fields and form controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter your name" />
            </div>
            <Button variant="default" size="sm" className="w-full">
              Submit Form
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Indicators</CardTitle>
            <CardDescription>Various states and feedback</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-background border rounded">Background</div>
              <div className="p-2 bg-muted rounded">Muted</div>
              <div className="p-2 bg-accent rounded">Accent</div>
              <div className="p-2 bg-card border rounded">Card</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>Text styles and hierarchy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <h1 className="text-2xl font-bold">Heading 1</h1>
            <h2 className="text-xl font-semibold">Heading 2</h2>
            <h3 className="text-lg font-medium">Heading 3</h3>
            <p className="text-base">Regular paragraph text with proper contrast and readability.</p>
            <p className="text-sm text-muted-foreground">Muted text for subtle information</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interactive Elements</CardTitle>
            <CardDescription>Buttons and clickable items</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="default" size="sm">Small</Button>
              <Button variant="outline" size="sm">Outline</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
              <Button variant="link" size="sm">Link</Button>
            </div>
            <Button variant="destructive" className="w-full">
              Destructive Action
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme Info</CardTitle>
            <CardDescription>Current theme details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Theme:</span>
                <span className="font-mono">{currentTheme?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mode:</span>
                <span className="font-mono">{isDark ? 'dark' : 'light'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available:</span>
                <span className="font-mono">{themes.length} themes</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Themes are synchronized with your REST API and persist across sessions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
