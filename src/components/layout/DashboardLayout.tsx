import React from "react"
import { Sidebar } from "./Sidebar"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 h-14 bg-sidebar border-b border-sidebar-border z-50 flex items-center px-4 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="ml-4 text-sidebar-foreground font-semibold">Inverly</div>
      </header>

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      
      <main className={cn(
        "lg:pl-64 transition-all duration-300 min-h-screen",
        "pt-14 lg:pt-0",
        className
      )}>
        <div className="container mx-auto pt-10 pb-6 md:px-6 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  )
} 