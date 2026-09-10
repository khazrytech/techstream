'use client';

import Link from "next/link"
import { Home, Film, Tv, Trophy, Radio } from "lucide-react"
import { useUIStore } from "@/stores/ui-store"

export function MobileBottomNav() {
  const { activeTab, setActiveTab } = useUIStore()

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home, href: '/' },
    { id: 'movies' as const, label: 'Movies', icon: Film, href: '/' },
    { id: 'series' as const, label: 'Series', icon: Tv, href: '/' },
    { id: 'sports' as const, label: 'Sports', icon: Trophy, href: '/' },
    { id: 'live' as const, label: 'Live', icon: Radio, href: '/' },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border bg-black/90 backdrop-blur-lg px-2 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive ? 'text-tech-red font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
