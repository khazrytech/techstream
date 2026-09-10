'use client';

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Play, Mail, Lock, User, Eye, EyeOff, ShieldCheck, Github, Chrome } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useAuthStore } from "@/stores/auth-store"
import Link from "next/link"

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const { login } = useAuthStore()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    login(email, name)
    router.push('/profile')
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Header Link */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition">
        <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center">
          <Play className="w-4 h-4 text-red-500 fill-red-500" />
        </div>
        <span className="font-bold tracking-wide">TechStream</span>
      </Link>

      <div className="w-full max-w-md space-y-6 z-10">
        
        {/* Card Switcher (Tab Buttons) */}
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all ${!isSignUp ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Ingia Akaunti
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all ${isSignUp ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Tengeneza Mpya
          </button>
        </div>

        {/* Main Auth Form Container */}
        <Card className="border border-white/10 bg-black/60 backdrop-blur-2xl rounded-3xl shadow-2xl">
          <CardContent className="p-8 space-y-6">
            
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                {isSignUp ? "Anza Kutazama Bure" : "Karibu Tena TechStream"}
              </h2>
              <p className="text-xs text-gray-400">
                {isSignUp ? "Tengeneza akaunti kwa sekunde chache ufurahie muvi za 4K" : "Weka taarifa zako hapa kuingia kwenye akaunti"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-medium">Jina Kamili</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="mf. Techboy TZ"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl h-11 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs text-gray-300 font-medium">Barua Pepe (Email)</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="jina@email.com"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl h-11 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-gray-300 font-medium">Neno la Siri (Password)</label>
                  {!isSignUp && (
                    <a href="#" className="text-xs text-red-400 hover:underline">Umesahau?</a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl h-11 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white h-11 rounded-xl font-bold shadow-lg shadow-red-600/30 transition-all mt-2">
                {isSignUp ? "Sajili Akaunti" : "Ingia Sasa"}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/80 px-2 text-gray-400">Au ingia na</span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => { login('googleuser@gmail.com', 'Google User'); router.push('/profile'); }}
                className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl h-10 gap-2"
              >
                <Chrome className="w-4 h-4 text-red-400" /> Google
              </Button>
              <Button 
                variant="outline" 
                onClick={() => { login('githubuser@github.com', 'GitHub User'); router.push('/profile'); }}
                className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl h-10 gap-2"
              >
                <Github className="w-4 h-4" /> GitHub
              </Button>
            </div>

            <div className="pt-2 text-center flex items-center justify-center gap-1.5 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-green-500" /> Taarifa zako zinalindwa kwa usalama wa hali ya juu
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
