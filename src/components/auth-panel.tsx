"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import { LogOut, User, Shield, Settings } from "lucide-react"
import Link from "next/link"

export function AuthPanel() {
  const { user, logout, isAuthenticated, isAdmin, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">Loading...</span>
        </div>
      </Card>
    )
  }

  if (isAuthenticated && user) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Welcome Back
            </h3>
            <Button onClick={logout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Name:</span>
              <span className="text-sm">{user.name}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Email:</span>
              <span className="text-sm">{user.email}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Role:</span>
              <Badge variant={isAdmin ? "default" : "secondary"} className="flex items-center gap-1">
                {isAdmin && <Shield className="h-3 w-3" />}
                {user.role}
              </Badge>
            </div>
          </div>

          <div className="pt-3 border-t">
            <div className="text-sm text-muted-foreground">
              {isAdmin ? (
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-foreground">🛡️ Admin Access Enabled</p>
                    <ul className="space-y-1 ml-4 mt-1">
                      <li>• Create and delete themes</li>
                      <li>• Manage theme settings</li>
                      <li>• Full system access</li>
                    </ul>
                  </div>
                  <Link href="/admin">
                    <Button size="sm" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Open Admin Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="font-medium text-foreground">👤 User Access</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Switch between themes</li>
                    <li>• Sync preferences with server</li>
                    <li>• Toggle dark/light mode</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User className="h-5 w-5" />
          Authentication Required
        </h3>
        
        <div className="text-sm text-muted-foreground">
          Sign in to access theme management features and sync your preferences.
        </div>

        <div className="space-y-3">
          <Link href="/login">
            <Button className="w-full">
              Sign In
            </Button>
          </Link>
          
          <div className="text-xs text-muted-foreground text-center">
            <p className="mb-2">Demo credentials available:</p>
            <div className="space-y-1">
              <div className="bg-muted p-2 rounded text-center">
                <strong>Admin:</strong> admin@demo.com / admin123
              </div>
              <div className="bg-muted p-2 rounded text-center">
                <strong>User:</strong> user@demo.com / user123
              </div>
              <div className="bg-muted p-2 rounded text-center">
                <strong>Your Account:</strong> solyman100200@gmail.com / solyman
              </div>
            </div>
            <p className="mt-2">Or use your real API credentials</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
