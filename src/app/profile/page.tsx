'use client';

import { useState, useEffect } from 'react'
import { useAuthStore } from "@/stores/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { 
  ArrowLeft, LogOut, Shield, Crown, Film, 
  Edit3, Smartphone, Heart, Clock, Play, CheckCircle, Sparkles, Trash2
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'watchlist' | 'subscription' | 'devices' | 'security'>('overview')
  
  const { user, isAuthenticated, logout, updateProfile, upgradePlan, removeFromWatchlist, removeDevice } = useAuthStore()
  const router = useRouter()

  const [editName, setEditName] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [savedMessage, setSavedMessage] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (user) {
      setEditName(user.name || "")
      setEditPhone(user.phone || "")
    }
  }, [user])

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

  const handleSimulatePayment = (planName: 'VIP Pro' | 'Ultra 4K Stream') => {
    upgradePlan(planName)
    setPaymentSuccess(true)
    setTimeout(() => setPaymentSuccess(false), 4000)
  }

  return (
    <div className="min-h-screen bg-black text-white p-3 sm:p-6 max-w-4xl mx-auto space-y-5 pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <Link href="/" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition text-xs font-semibold">
          <ArrowLeft className="w-4 h-4" />
          <span>Rudi Nyumbani</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
            user.plan === 'Free' ? 'bg-gray-800 text-gray-300' : 'bg-gradient-to-r from-red-600 to-amber-500 text-white'
          }`}>
            {user.plan}
          </span>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => {
              logout()
              router.push('/')
            }}
            className="bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white rounded-xl text-[11px] font-bold gap-1 h-8 px-2.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Toka
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="border border-white/10 bg-gradient-to-r from-red-950/40 via-black/80 to-black p-4 sm:p-6 rounded-3xl relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left relative z-10">
          <Avatar className="h-20 w-20 border-2 border-red-600 ring-4 ring-red-600/20 shadow-xl shrink-0">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-red-600 text-white text-2xl font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : 'T'}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              <h1 className="text-xl sm:text-2xl font-black">{user.name}</h1>
              {user.plan !== 'Free' && <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />}
            </div>
            <p className="text-xs text-gray-400 truncate max-w-xs sm:max-w-md">{user.email} • {user.phone || 'Weka Namba'}</p>
            
            <div className="pt-2 grid grid-cols-3 gap-2 max-w-sm mx-auto sm:mx-0">
              <div className="bg-white/5 border border-white/10 p-2 rounded-2xl text-center">
                <p className="text-base font-black text-red-500">{user.stats?.hoursWatched || 0}h</p>
                <p className="text-[9px] text-gray-400 uppercase font-semibold">Saa</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-2 rounded-2xl text-center">
                <p className="text-base font-black text-amber-400">{user.stats?.moviesCompleted || 0}</p>
                <p className="text-[9px] text-gray-400 uppercase font-semibold">Zilizokamilika</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-2 rounded-2xl text-center">
                <p className="text-base font-black text-green-400">{user.watchlist?.length || 0}</p>
                <p className="text-[9px] text-gray-400 uppercase font-semibold">Watchlist</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <div className="flex gap-1.5 border-b border-white/10 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Overview', icon: Film },
          { id: 'profile', label: 'Hariri', icon: Edit3 },
          { id: 'watchlist', label: 'Watchlist', icon: Heart },
          { id: 'subscription', label: 'Lipia VIP', icon: Crown },
          { id: 'devices', label: 'Vifaa', icon: Smartphone },
          { id: 'security', label: 'Usalama', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                isActive ? 'bg-red-600 text-white shadow-md' : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* TAB CONTENT AREAS */}
      <div className="pt-2">
        {activeTab === 'overview' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-2 text-gray-300">
              <Clock className="w-4 h-4 text-red-500" /> Endelea Kutazama
            </h3>
            {user.history && user.history.length > 0 ? (
              <div className="space-y-2.5">
                {user.history.map((item) => (
                  <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-2.5 flex gap-3 items-center">
                    <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-5 h-5 fill-white text-white" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-bold text-xs truncate">{item.title}</h4>
                      <p className="text-[10px] text-gray-400">{item.duration}</p>
                      <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                        <div className="bg-red-600 h-full rounded-full" style={{ width: `${item.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-xs py-4 text-center bg-white/5 rounded-2xl border border-white/5">Huna historia ya video kwa sasa.</p>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <Card className="border border-white/10 bg-white/5 p-4 sm:p-6 rounded-3xl space-y-4 max-w-md mx-auto">
            <h3 className="text-sm font-bold">Hariri Taarifa Zako</h3>
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] text-gray-300 font-semibold">Jina Lako</label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-black/60 border-white/10 text-white rounded-xl h-10 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-gray-300 font-semibold">Namba ya Simu</label>
                <Input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+255 7..."
                  className="bg-black/60 border-white/10 text-white rounded-xl h-10 text-xs"
                />
              </div>
              <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl h-10 w-full text-xs">
                Hifadhi Mabadiliko
              </Button>
              {savedMessage && <p className="text-[11px] text-green-400 font-bold text-center">Imehifadhiwa kikamilifu!</p>}
            </form>
          </Card>
        )}

        {activeTab === 'watchlist' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-300">Watchlist Yako</h3>
            {user.watchlist && user.watchlist.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {user.watchlist.map((item) => (
                  <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-2.5 space-y-2">
                    <img src={item.image} alt={item.title} className="w-full h-28 object-cover rounded-xl" />
                    <h4 className="font-bold text-xs truncate">{item.title}</h4>
                    <div className="flex justify-between items-center text-[10px] text-gray-400">
                      <span>{item.category}</span>
                      <span className="text-amber-400 font-bold">★ {item.rating}</span>
                    </div>
                    <Button 
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFromWatchlist(item.id)}
                      className="w-full bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-xl text-[10px] h-7 gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Ondoa
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-xs py-4 text-center bg-white/5 rounded-2xl border border-white/5">Watchlist yako ipo wazi.</p>
            )}
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="space-y-4 max-w-xl mx-auto">
            <div className="space-y-1 text-center">
              <h3 className="text-sm font-bold flex items-center justify-center gap-1.5 text-amber-400">
                <Sparkles className="w-4 h-4" /> Vifurushi vya VIP
              </h3>
              <p className="text-[11px] text-gray-400">Chagua kifurushi na ulipe kupitia mitandao ya simu.</p>
            </div>

            {paymentSuccess && (
              <div className="bg-green-600/20 border border-green-500/40 p-3 rounded-2xl flex items-center gap-2 text-green-400 font-bold text-xs">
                <CheckCircle className="w-4 h-4 shrink-0" /> Malipo yamefanikiwa! Umepata VIP.
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-3">
              <div className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
                user.plan === 'VIP Pro' ? 'bg-red-950/30 border-red-500' : 'bg-white/5 border-white/10'
              }`}>
                <div className="space-y-1.5">
                  <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full">Maarufu</span>
                  <h4 className="text-base font-black">VIP Pro</h4>
                  <p className="text-xl font-black text-red-500">TZS 5,000 <span className="text-[10px] text-gray-400 font-normal">/ mwezi</span></p>
                  <ul className="text-[11px] text-gray-300 space-y-1 pt-1">
                    <li>✓ 1080p Full HD</li>
                    <li>✓ Bila Matangazo</li>
                  </ul>
                </div>
                <Button 
                  onClick={() => handleSimulatePayment('VIP Pro')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl h-9 text-xs"
                >
                  {user.plan === 'VIP Pro' ? 'Plan Yako' : 'Lipia Pro'}
                </Button>
              </div>

              <div className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
                user.plan === 'Ultra 4K Stream' ? 'bg-amber-950/30 border-amber-500' : 'bg-white/5 border-white/10'
              }`}>
                <div className="space-y-1.5">
                  <span className="text-[10px] bg-amber-500 text-black font-black px-2 py-0.5 rounded-full">Ultimate</span>
                  <h4 className="text-base font-black">Ultra 4K</h4>
                  <p className="text-xl font-black text-amber-400">TZS 12,000 <span className="text-[10px] text-gray-400 font-normal">/ mwezi</span></p>
                  <ul className="text-[11px] text-gray-300 space-y-1 pt-1">
                    <li>✓ 4K Ultra HD</li>
                    <li>✓ Pakua Offline</li>
                  </ul>
                </div>
                <Button 
                  onClick={() => handleSimulatePayment('Ultra 4K Stream')}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl h-9 text-xs"
                >
                  {user.plan === 'Ultra 4K Stream' ? 'Plan Yako' : 'Lipia 4K'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'devices' && (
          <div className="space-y-3 max-w-md mx-auto">
            <h3 className="text-sm font-bold text-gray-300">Vifaa Vilivyyounganishwa</h3>
            <div className="space-y-2">
              {user.devices?.map((dev) => (
                <div key={dev.id} className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs">{dev.name}</h4>
                    <p className="text-[10px] text-gray-400">{dev.type} • {dev.lastActive}</p>
                  </div>
                  {dev.current ? (
                    <span className="text-[10px] bg-green-500/20 text-green-400 font-bold px-2.5 py-1 rounded-full border border-green-500/30">Hiki</span>
                  ) : (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeDevice(dev.id)}
                      className="bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-xl text-[10px] h-7 px-2"
                    >
                      Ondoa
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <Card className="border border-white/10 bg-white/5 p-4 sm:p-6 rounded-3xl space-y-3 max-w-sm mx-auto text-center">
            <h3 className="text-sm font-bold text-red-500">Usalama na Kutoka</h3>
            <p className="text-[11px] text-gray-400">Unaweza kutoka kwenye akaunti yako muda wowote kwa usalama.</p>
            <Button
              variant="destructive"
              className="w-full bg-red-600 hover:bg-red-700 text-white rounded-2xl h-10 font-bold gap-2 text-xs"
              onClick={() => {
                logout()
                router.push('/')
              }}
            >
              <LogOut className="w-4 h-4" /> Toka Kwenye Akaunti (Logout)
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
