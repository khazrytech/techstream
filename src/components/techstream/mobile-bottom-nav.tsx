'use client';

import { Home, Film, Tv, Trophy, Radio, User } from "lucide-react"
import { useUIStore } from "@/stores/ui-store"
import { useAuthStore } from "@/stores/auth-store"
import { useRouter } from "next/navigation"

export function MobileBottomNav() {
  const { activeTab, setActiveTab } = useUIStore()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'movies' as const, label: 'Movies', icon: Film },
    { id: 'series' as const, label: 'Series', icon: Tv },
    { id: 'sports' as const, label: 'Sports', icon: Trophy },
    { id: 'live' as const, label: 'Live', icon: Radio },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ]

  const handleTabClick = (id: string) => {
    setActiveTab(id as any)
    if (id === 'profile') {
      if (isAuthenticated) {
        router.push('/profile')
      } else {
        router.push('/auth')
      }
    } else {
      router.push('/')
    }
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border bg-black/95 backdrop-blur-xl px-1 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 px-1 rounded-lg transition-all active:scale-95 ${
                isActive ? 'text-tech-red font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] leading-none">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
