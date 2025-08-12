import { ThemeSwitcher } from "@/components/theme-switcher"
import { ThemeShowcase } from "@/components/theme-showcase"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Theme System Demo</h1>
          <ThemeSwitcher />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <ThemeShowcase />
      </main>
    </div>
  )
}
