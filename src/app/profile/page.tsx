'use client';

import { useAuthStore } from "@/stores/auth-store"
import { useProfileStore } from "@/stores/profile-store"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, LogOut, Settings, Shield, Bell } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { isAuthenticated, logout, user } = useAuthStore()
  const { currentProfile } = useProfileStore()
  const router = useRouter()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md border-border bg-card/50">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Hujaingia Kwenye Akaunti</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground text-sm">Tafadhali ingia au jisajili ili kuona profile yako.</p>
            <Button asChild className="w-full bg-tech-red hover:bg-tech-red/90 text-white">
              <Link href="/auth">Ingia Akaunti</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-white">
          <ArrowLeft className="w-5 h-5" />
          <span>Rudi Nyumbani</span>
        </Link>
        <h1 className="text-xl font-bold">Profile Yangu</h1>
      </div>

      <Card className="border-border bg-card/50 backdrop-blur-md">
        <CardContent className="p-6 flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-tech-red">
            <AvatarImage src={currentProfile?.avatar} />
            <AvatarFallback className="bg-tech-red text-white text-xl">
              {(currentProfile?.name || user?.name || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-xl font-bold">{currentProfile?.name || user?.name || "User"}</h2>
            <p className="text-sm text-muted-foreground">{user?.email || "user@techstream.com"}</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button variant="outline" className="w-full justify-start gap-3 h-12 text-left">
          <Settings className="w-5 h-5 text-tech-red" />
          <span>Mipangilio ya Akaunti (Account Settings)</span>
        </Button>
        <Button variant="outline" className="w-full justify-start gap-3 h-12 text-left">
          <Bell className="w-5 h-5 text-tech-blue" />
          <span>Taarifa na Notifications</span>
        </Button>
        <Button variant="outline" className="w-full justify-start gap-3 h-12 text-left">
          <Shield className="w-5 h-5 text-green-500" />
          <span>Ulinzi na Faragha (Privacy & Security)</span>
        </Button>
        <Button
          variant="destructive"
          className="w-full justify-start gap-3 h-12 text-left mt-6"
          onClick={() => {
            if (logout) logout()
            router.push('/auth')
          }}
        >
          <LogOut className="w-5 h-5" />
          <span>Toka Kwenye Akaunti (Sign Out)</span>
        </Button>
      </div>
    </div>
  )
}
