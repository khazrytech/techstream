'use client';

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Play, Search, Bell, Home, Film, Tv, Trophy, Radio, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/stores/auth-store"

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Nyumbani', icon: Home, href: '/' },
    { label: 'Movies', icon: Film, href: '/#movies' },
    { label: 'Series', icon: Tv, href: '/#series' },
    { label: 'Sports', icon: Trophy, href: '/#sports' },
    { label: 'Live TV', icon: Radio, href: '/#live' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-2xl' : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition">
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
              <span className="text-xl font-black tracking-wider text-white">
                Tech<span className="text-red-500">Stream</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2"
                >
                  <item.icon className="w-4 h-4 text-red-500" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10 rounded-xl">
              <Search className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10 rounded-xl relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-black" />
            </Button>

            {mounted && isAuthenticated && user ? (
              <Link href="/profile" className="flex items-center gap-2 pl-2 border-l border-white/10">
                <Avatar className="h-9 w-9 ring-2 ring-red-600 hover:scale-105 transition cursor-pointer">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-red-600 text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline text-sm font-semibold truncate max-w-[100px]">{user.name}</span>
              </Link>
            ) : (
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold px-4 h-9">
                <Link href="/auth">
                  <User className="w-4 h-4 mr-1.5" /> Ingia
                </Link>
              </Button>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}
