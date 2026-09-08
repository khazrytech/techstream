"use client"

import { Home, Search, Trophy, Heart, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUIStore } from "@/stores/ui-store"
import { useAuthStore } from "@/stores/auth-store"
import { Badge } from "@/components/ui/badge"

export function MobileBottomNav() {
  const { activeTab, setActiveTab, setSearchOpen } = useUIStore()
  const { isAuthenticated } = useAuthStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16 px-4">
        <Button
          variant={activeTab === 'home' ? "default" : "ghost"}
          size="icon"
          onClick={() => setActiveTab('home')}
          className="flex-1"
        >
          <Home className="w-5 h-5" />
        </Button>

        <Button
          variant={activeTab === 'movies' || activeTab === 'series' ? "default" : "ghost"}
          size="icon"
          onClick={() => setActiveTab('movies')}
          className="flex-1"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <Button
          variant={activeTab === 'sports' ? "default" : "ghost"}
          size="icon"
          onClick={() => setActiveTab('sports')}
          className="flex-1"
        >
          <Trophy className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSearchOpen(true)}
          className="flex-1"
        >
          <Search className="w-5 h-5" />
        </Button>

        {isAuthenticated ? (
          <Button
            variant={activeTab === 'mylist' ? "default" : "ghost"}
            size="icon"
            onClick={() => setActiveTab('mylist')}
            className="flex-1"
          >
            <Heart className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            variant={activeTab === 'profile' ? "default" : "ghost"}
            size="icon"
            onClick={() => setActiveTab('profile')}
            className="flex-1"
          >
            <User className="w-5 h-5" />
          </Button>
        )}
      </div>
    </nav>
  )
}
