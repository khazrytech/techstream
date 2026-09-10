'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Mail, Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: Math.random().toString(36).substring(2, 9),
      name: isLogin ? email.split('@')[0] : name,
      email: email,
      role: 'user'
    });
    router.push('/profile');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-6">
      <div className="max-w-md mx-auto w-full space-y-8 pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold transition">
          <ArrowLeft className="w-4 h-4" /> Rudi Nyumbani
        </Link>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-red-600/20 border border-red-500/30 text-red-500 mb-2">
            <Play className="w-8 h-8 fill-red-500" />
          </div>
          <h1 className="text-2xl font-black">Karibu TechStream</h1>
          <p className="text-xs text-gray-400">Ingia au fungua akaunti ili uanze kufurahia huduma zetu</p>
        </div>

        <Card className="bg-white/5 border-white/10 rounded-3xl backdrop-blur-xl">
          <CardContent className="p-6 space-y-6">
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 text-xs font-black rounded-xl transition ${isLogin ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                Ingia (Login)
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 text-xs font-black rounded-xl transition ${!isLogin ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                Jisajili (Register)
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Jina Lako</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                    <Input 
                      type="text" 
                      placeholder="Weka jina lako kamili" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required 
                      className="bg-black/50 border-white/10 pl-10 rounded-2xl text-xs h-11 text-white"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Barua Pepe (Email)</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                  <Input 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    className="bg-black/50 border-white/10 pl-10 rounded-2xl text-xs h-11 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Nenosiri (Password)</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="bg-black/50 border-white/10 pl-10 pr-10 rounded-2xl text-xs h-11 text-white"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs h-12 rounded-2xl shadow-lg transition">
                {isLogin ? 'Ingia Kwenye Akaunti' : 'Fungua Akaunti Mpya'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-[10px] text-gray-500 flex items-center justify-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5 text-red-500" /> Usalama wa akaunti yako umehakikishwa na TechStream.
      </div>
    </div>
  );
}
