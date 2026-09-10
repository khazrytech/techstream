'use client';

import { useState, useEffect } from 'react'
import { useAuthStore } from "@/stores/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { 
  ArrowLeft, LogOut, Settings, Shield, Crown, Film, 
  Edit3, Smartphone, Heart, Clock, Play
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'watchlist' | 'subscription' | 'devices' | 'settings' | 'security'>('overview')
  
  const { user, isAuthenticated, logout, updateProfile } = useAuthStore()
  const router = useRouter()

  const [editName, setEditName] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [savedMessage, setSavedMessage] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (user) {
      setEditName(user.name || "")
      setEditPhone(user.phone || "")
    }
  }, [user])

  // Zuia client-side render kabla ya component haijapanda vizuri kwenye browser
  if (!mounted) {
    return <div className="min-h-screen bg-black" />
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4">
        <Card className="w-full max-w-md border-white/10 bg-black/80 text-white text-center p-8 rounded-3xl">
          <Crown className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Hujaingia Kwenye Akaunti</h2>
          <p className="text-gray-400 text-sm mb-6">Tafadhali ingia au jisajili ili kutazama profile yako.</p>
          <Button asChild className="bg-red-600 hover:bg-red-700 text-white w-full rounded-2xl h-12 font-bold">
            <Link href="/">Rudi Mwanzo</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({ name: editName, phone: editPhone })
    setSavedMessage(true)
    setTimeout(() => setSavedMessage(false), 3000)
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 max-w-6xl mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold text-sm">Rudi Nyumbani</span>
        </Link>
        <span className="text-xs bg-gradient-to-r from-red-600 to-amber-500 text-white font-black px-3 py-1 rounded-full uppercase tracking-wider">
          {user.plan || 'VIP'} MEMBER
        </span>
      </div>

      <Card className="border border-white/10 bg-gradient-to-r from-red-950/40 via-black/80 to-black p-6 rounded-3xl relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <Avatar className="h-24 w-24 border-2 border-red-600 ring-4 ring-red-600/20 shadow-2xl">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-red-600 text-white text-3xl font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : 'T'}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black">{user.name}</h1>
              <Crown className="w-6 h-6 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-sm text-gray-400">{user.email} • {user.phone || 'Bila Namba'}</p>
            
            <div className="pt-2 grid grid-cols-3 gap-2 sm:gap-4 max-w-md">
              <div className="bg-white/5 border border-white/10 p-2.5 rounded-2xl text-center">
                <p className="text-lg font-black text-red-500">{user.stats?.hoursWatched || 0}h</p>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">Saa za Stream</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-2.5 rounded-2xl text-center">
                <p className="text-lg font-black text-amber-400">{user.stats?.moviesCompleted || 0}</p>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">Zilizokamilika</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-2.5 rounded-2xl text-center">
                <p className="text-lg font-black text-green-400">{user.watchlist?.length || 0}</p>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">Watchlist</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Overview', icon: Film },
          { id: 'profile', label: 'Hariri Profile', icon: Edit3 },
          { id: 'watchlist', label: 'Watchlist', icon: Heart },
          { id: 'security', label: 'Ulinzi', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive ? 'bg-red-600 text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-500" /> Endelea Kutazama
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {user.history?.map((item) => (
              <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex gap-4 items-center">
                <div className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-6 h-6 fill-white text-white" />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-bold text-sm truncate">{item.title}</h4>
                  <p className="text-xs text-gray-400">{item.duration}</p>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-red-600 h-full rounded-full" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <Card className="border border-white/10 bg-white/5 p-6 rounded-3xl space-y-6">
          <h3 className="text-lg font-bold">Hariri Taarifa Zako</h3>
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-300 font-semibold">Jina Lako</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-black/60 border-white/10 text-white rounded-xl h-11"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-300 font-semibold">Namba ya Simu</label>
              <Input
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="bg-black/60 border-white/10 text-white rounded-xl h-11"
              />
            </div>
            <Button type="submit" className="bg-red-600 text-white font-bold rounded-xl h-11 px-8">
              Hifadhi
            </Button>
            {savedMessage && <span className="ml-3 text-xs text-green-400 font-bold">Imehifadhiwa!</span>}
          </form>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card className="border border-white/10 bg-white/5 p-6 rounded-3xl space-y-4">
          <Button
            variant="destructive"
            className="w-full bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white rounded-2xl h-12 font-bold gap-2"
            onClick={() => {
              logout()
              router.push('/')
            }}
          >
            <LogOut className="w-5 h-5" /> Toka Kwenye Akaunti
          </Button>
        </Card>
      )}
    </div>
  )
}
