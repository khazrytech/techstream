'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Film, Tv, Radio, User } from "lucide-react"

export function BottomNav() {
  const pathname = usePathname()

  const items = [
    { label: 'Mwanzo', icon: Home, href: '/' },
    { label: 'Movies', icon: Film, href: '/#movies' },
    { label: 'Series', icon: Tv, href: '/#series' },
    { label: 'Live TV', icon: Radio, href: '/#live' },
    { label: 'Profile', icon: User, href: '/profile' },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-2xl border-t border-white/10 px-2 py-2">
      <div className="flex justify-around items-center">
        {items.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition ${
                isActive 
                  ? 'text-red-500 font-bold scale-105' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-red-500' : ''}`} />
              <span className="text-[10px] mt-1 font-medium tracking-tight">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
