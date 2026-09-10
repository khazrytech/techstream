'use client';

import { Navbar } from "@/components/techstream/navbar"
import { BottomNav } from "@/components/techstream/bottom-nav"
import { HeroSlider } from "@/components/techstream/hero-slider"
import { Play, TrendingUp, Star } from "lucide-react"

const MOVIES = [
  { id: '1', title: 'Cyberpunk 2088', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop', year: '2025', rating: '4.8', category: 'Sci-Fi' },
  { id: '2', title: 'The Kingdom of Zanj', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop', year: '2026', rating: '5.0', category: 'Action' },
  { id: '3', title: 'Avatar: Way of Water', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop', year: '2024', rating: '4.9', category: 'Adventure' },
  { id: '4', title: 'Interstellar Horizons', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop', year: '2024', rating: '4.7', category: 'Sci-Fi' },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white pb-24 relative">
      <Navbar />
      <HeroSlider />

      <div id="movies" className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">Inayovuma Hivi Sasa</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {MOVIES.map((movie) => (
            <div 
              key={movie.id} 
              className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-red-500/50 transition duration-300 cursor-pointer"
            >
              <div className="aspect-[2/3] w-full relative overflow-hidden">
                <img 
                  src={movie.image} 
                  alt={movie.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition duration-300">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/50">
                    <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="p-3 space-y-1">
                <h3 className="font-bold text-xs sm:text-sm truncate">{movie.title}</h3>
                <div className="flex justify-between items-center text-[11px] text-gray-400">
                  <span>{movie.year} • {movie.category}</span>
                  <span className="flex items-center text-amber-400 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 mr-1" /> {movie.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
