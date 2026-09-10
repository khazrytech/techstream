'use client';

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Play, Search, Bell, User, Home, Film, Tv, Trophy, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useUIStore } from "@/stores/ui-store"
import { useAuthStore } from "@/stores/auth-store"

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const { activeTab, setActiveTab, setSearchOpen } = useUIStore()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home, href: '/' },
    { id: 'movies' as const, label: 'Movies', icon: Film, href: '/movies' },
    { id: 'series' as const, label: 'Series', icon: Tv, href: '/series' },
    { id: 'sports' as const, label: 'Sports', icon: Trophy, href: '/sports' },
    { id: 'live' as const, label: 'Live', icon: Radio, href: '/live' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-tech-red to-tech-blue flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-xl font-bold gradient-text">TechStream</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    asChild
                    variant={activeTab === item.id ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Link href={item.href} onClick={() => setActiveTab(item.id)}>
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="flex"
            >
              <Search className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="icon" className="hidden sm:flex relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute top-2 right-2 h-2 w-2 p-0 bg-tech-red" />
            </Button>

            {mounted && isAuthenticated && user ? (
              <Link href="/profile">
                <Avatar className="h-9 w-9 cursor-pointer border-2 border-tech-red">
                  <AvatarImage src={user.avatar || ''} />
                  <AvatarFallback className="bg-tech-red text-white font-bold">
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link href="/auth">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
