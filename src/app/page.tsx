import { ThemeShowcase } from "@/components/theme-showcase"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { AuthPanel } from "@/components/auth-panel"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">REST API Theme System</h1>
          <ThemeSwitcher />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Theme Showcase */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Theme Showcase</h2>
            <ThemeShowcase />
          </div>

          {/* Authentication System */}
          <div>
            <h2 className="text-xl font-semibold mb-4">User Authentication</h2>
            <AuthPanel />
          </div>
        </div>

        {/* Features Overview */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">🚀 Features Implemented</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-medium mb-2">� REST API Ready</h3>
              <p className="text-sm text-muted-foreground">
                Complete API client with authentication, error handling, and retry logic
              </p>
            </div>
            
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-medium mb-2">� Auth & Authorization</h3>
              <p className="text-sm text-muted-foreground">
                JWT tokens, role-based access, automatic refresh, and secure cookie storage
              </p>
            </div>
            
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-medium mb-2">📡 Offline/Online Mode</h3>
              <p className="text-sm text-muted-foreground">
                Graceful degradation with local theme storage when API is unavailable
              </p>
            </div>
            
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-medium mb-2">⚡ Optimistic Updates</h3>
              <p className="text-sm text-muted-foreground">
                Instant UI updates with background sync and automatic error recovery
              </p>
            </div>
            
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-medium mb-2">🎨 Admin Theme Management</h3>
              <p className="text-sm text-muted-foreground">
                Create, update, delete themes with role-based permissions
              </p>
            </div>
            
            <div className="bg-card border rounded-lg p-4">
              <h3 className="font-medium mb-2">🛡️ Error Handling</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive error handling with user-friendly notifications
              </p>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">🔧 Technical Implementation</h2>
          <div className="bg-card border rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Frontend Stack</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Next.js 15.4.6 with App Router</li>
                  <li>• TypeScript for type safety</li>
                  <li>• TanStack Query for data fetching</li>
                  <li>• Zustand for state management</li>
                  <li>• Tailwind CSS + Radix UI</li>
                  <li>• Axios with interceptors</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">API Integration</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• JWT authentication with refresh</li>
                  <li>• Role-based access control</li>
                  <li>• Automatic token management</li>
                  <li>• Network error recovery</li>
                  <li>• Optimistic UI updates</li>
                  <li>• Cookie-based persistence</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
