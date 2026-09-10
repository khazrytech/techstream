'use client';

import { useState, useEffect } from 'react'
import { useAuthStore } from "@/stores/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft, LogOut, Settings, Shield, Bell, Crown, Film, 
  Tv, Check, Edit3, Smartphone, Monitor, Globe, Sparkles 
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'settings' | 'watchlist'>('profile')
  
  const { user, isAuthenticated, logout, updateProfile, toggleSetting } = useAuthStore()
  const router = useRouter()

  const [editName, setEditName] = useState("")
  const [savedMessage, setSavedMessage] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (user) {
      setEditName(user.name)
    }
  }, [user])

  if (!mounted) return <div className="min-h-screen bg-black" />

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4">
        <Card className="w-full max-w-md border-white/10 bg-black/80 text-white text-center p-6">
          <h2 className="text-2xl font-bold mb-2">Hujaingia Kwenye Akaunti</h2>
          <p className="text-gray-400 text-sm mb-6">Tafadhali ingia ili kutazama profile yako na mipangilio.</p>
          <Button asChild className="bg-red-600 hover:bg-red-700 text-white w-full rounded-xl">
            <Link href="/auth">Ingia Akaunti Sasa</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({ name: editName })
    setSavedMessage(true)
    setTimeout(() => setSavedMessage(false), 3000)
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Rudi Nyumbani</span>
        </Link>
        <span className="text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full font-bold">
          VIP DASHBOARD
        </span>
      </div>

      {/* Profile Header Banner */}
      <Card className="border border-white/10 bg-gradient-to-r from-red-950/40 via-black to-black p-6 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <Avatar className="h-24 w-24 border-2 border-red-600 ring-4 ring-red-600/20 shadow-xl">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-red-600 text-white text-3xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-sm text-gray-400">{user.email}</p>
            <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-md font-semibold">
                Kifurushi: {user.plan}
              </span>
              <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2.5 py-0.5 rounded-md font-semibold">
                Akaunti Inafanya Kazi
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition ${activeTab === 'profile' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white bg-white/5'}`}
        >
          <Edit3 className="w-4 h-4" /> Profile Info
        </button>
        <button
          onClick={() => setActiveTab('subscription')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition ${activeTab === 'subscription' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white bg-white/5'}`}
        >
          <Crown className="w-4 h-4" /> Kifurushi & VIP
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition ${activeTab === 'settings' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white bg-white/5'}`}
        >
          <Settings className="w-4 h-4" /> Mipangilio
        </button>
      </div >

      {/* Tab 1: Profile Info Form */}
      {activeTab === 'profile' && (
        <Card className="border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold">Badilisha Taarifa za Profile</h3>
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label className="text-xs text-gray-300">Jina Lako</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-black/60 border-white/10 text-white rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-300">Barua Pepe (Huwezi kubadilisha)</label>
              <Input
                value={user.email}
                disabled
                className="bg-black/40 border-white/5 text-gray-500 rounded-xl cursor-not-allowed"
              />
            </div>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl px-6">
              Hifadhi Marekebisho
            </Button>
            {savedMessage && (
              <span className="ml-3 text-xs text-green-400 font-semibold inline-flex items-center gap-1">
                <Check className="w-4 h-4" /> Zimehifadhiwa kikamilifu!
              </span>
            )}
          </form>
        </Card>
      )}

      {/* Tab 2: Subscription Plans */}
      {activeTab === 'subscription' && (
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="border border-white/10 bg-white/5 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-lg">VIP Pro Stream</h4>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-red-500">TSh 10,000 <span className="text-xs text-gray-400 font-normal">/ kwa mwezi</span></p>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Ubora wa HD & Full HD (1080p)</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Vifaa 2 kwa wakati mmoja</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> BILA MATANGAZO</li>
            </ul>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold">
              Kifurushi Chako cha Sasa
            </Button>
          </Card>

          <Card className="border border-amber-500/40 bg-amber-500/5 p-6 rounded-2xl space-y-4 relative">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-lg text-amber-300">Ultra 4K Cinema</h4>
              <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-400">TSh 20,000 <span className="text-xs text-gray-400 font-normal">/ kwa mwezi</span></p>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Ubora wa Ultra HD 4K + HDR</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Vifaa 4 kwa wakati mmoja</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Download na angalia Offline</li>
            </ul>
            <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-xl shadow-lg shadow-amber-500/20">
              Upgrade kwenda Ultra 4K
            </Button>
          </Card>
        </div>
      )}

      {/* Tab 3: Interactive Settings Switches */}
      {activeTab === 'settings' && (
        <Card className="border border-white/10 bg-white/5 p-6 rounded-2xl space-y-4">
          <h3 className="text-lg font-bold mb-4">Mipangilio ya Video na Akaunti</h3>
          
          <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
            <div>
              <p className="text-sm font-semibold">Ubora wa Video (Auto 4K / HD)</p>
              <p className="text-xs text-gray-400">Tumia data kwa ubora wa juu kabisa mtandao ukiwa imara</p>
            </div>
            <button
              onClick={() => toggleSetting('hdQuality')}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${user.settings.hdQuality ? 'bg-red-600 justify-end' : 'bg-gray-700 justify-start'}`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
            <div>
              <p className="text-sm font-semibold">Kipengele cha Auto-Play</p>
              <p className="text-xs text-gray-400">Cheza sehemu inayofuata kiotomatiki</p>
            </div>
            <button
              onClick={() => toggleSetting('autoPlay')}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${user.settings.autoPlay ? 'bg-red-600 justify-end' : 'bg-gray-700 justify-start'}`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
            <div>
              <p className="text-sm font-semibold">Taarifa za Email (Notifications)</p>
              <p className="text-xs text-gray-400">Pata taarifa pindi muvi au tamthilia mpya inapowekwa</p>
            </div>
            <button
              onClick={() => toggleSetting('notifications')}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${user.settings.notifications ? 'bg-red-600 justify-end' : 'bg-gray-700 justify-start'}`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Logout Button */}
          <div className="pt-4 border-t border-white/10">
            <Button
              variant="destructive"
              className="bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white rounded-xl gap-2 font-bold"
              onClick={() => {
                logout()
                router.push('/auth')
              }}
            >
              <LogOut className="w-4 h-4" /> Toka Kwenye Akaunti (Sign Out)
            </Button>
          </div>
        </Card>
      )}

    </div>
  )
}
