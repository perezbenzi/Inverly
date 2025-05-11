import React from "react"
import { User, LogOut, X, Settings, Home, Calculator } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"

interface SidebarProps {
  className?: string
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function Sidebar({ className, isOpen, setIsOpen }: SidebarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
      toast.success('Session closed successfully')
    } catch (error) {
      console.error('Error logging out:', error)
      toast.error('Error logging out')
    }
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-3 right-4 z-50 lg:hidden text-sidebar-foreground"
          onClick={closeSidebar}
        >
          <X className="h-6 w-6" />
        </Button>
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "pt-14 lg:pt-0", 
          className
        )}
      >
        <div className="flex flex-col h-full">
          <div className="hidden lg:block px-4 py-6 border-b border-sidebar-border">
            <h2 className="text-xl font-semibold text-sidebar-foreground">finance-track</h2>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-2">
            <Link 
              to="/" 
              className="flex items-center gap-2 p-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              onClick={isOpen ? closeSidebar : undefined}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link 
              to="/scenarios" 
              className="flex items-center gap-2 p-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              onClick={isOpen ? closeSidebar : undefined}
            >
              <Calculator className="h-5 w-5" />
              <span>Scenarios</span>
            </Link>
            <Link 
              to="/settings" 
              className="flex items-center gap-2 p-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              onClick={isOpen ? closeSidebar : undefined}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>

          <div className="px-4 py-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.email || 'User'}
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 py-4 border-t border-sidebar-border mt-auto">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 text-sidebar-foreground bg-transparent border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
} 