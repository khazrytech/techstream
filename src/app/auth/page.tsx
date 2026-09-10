'use client';

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Play, Mail, Lock, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuthStore } from "@/stores/auth-store"
import Link from "next/link"

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const { login } = useAuthStore()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const userName = name.trim() || email.split('@')[0] || 'User'
    login({ id: '1', email, name: userName, avatar: '' })
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center px-4 relative">
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-5 h-5" />
        <span>Rudi Nyumbani</span>
      </Link>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tech-red to-tech-blue flex items-center justify-center mx-auto">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">TechStream</h1>
        </div>

        <Card className="border-border bg-card/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle>{isSignUp ? "Tengeneza Akaunti" : "Ingia Kwenye Akaunti"}</CardTitle>
            <CardDescription>
              {isSignUp ? "Jaza taarifa zako kuanza kutazama" : "Weka barua pepe na neno la siri"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Jina Kamili"
                      className="pl-9"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Barua Pepe (Email)"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Neno la Siri (Password)"
                    className="pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-tech-red hover:bg-tech-red/90 text-white">
                {isSignUp ? "Sajili Akaunti" : "Ingia"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-muted-foreground hover:underline"
              >
                {isSignUp ? "Unayo akaunti tayari? Ingia" : "Huna akaunti? Jisajili hapa"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
