'use client';

import { useState, useEffect } from 'react'
import { Play, Info, Star, Sparkles, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const HERO_SLIDES = [
  {
    id: '1',
    title: 'AVATAR: THE WAY OF WATER',
    description: 'Rudi kwenye ulimwengu wa ajabu wa Pandora. Jake Sully na Neytiri wanafanya kila njia kulinda familia zao dhidi ya hatari mpya.',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    rating: '4.9',
    year: '2024',
    genre: ['Action', 'Sci-Fi', 'Adventure'],
    badge: 'Trending #1'
  },
  {
    id: '2',
    title: 'CYBERPUNK 2088: REVOLUTION',
    description: 'Katika jiji la technolojia ya juu la Neon City, kundi la vijana wanapambana na mashirika makubwa yanayotawala akili za watu.',
    backdrop: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600&auto=format&fit=crop',
    rating: '4.8',
    year: '2025',
    genre: ['Cyberpunk', 'Action'],
    badge: 'TechStream Exclusive'
  },
  {
    id: '3',
    title: 'THE KINGDOM OF ZANJ',
    description: 'Simulizi ya kusisimua ya ufalme wa kale wa Pwani ya Afrika Mashariki, biashara za baharini, na vita vya kutetea uhuru.',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
    rating: '5.0',
    year: '2026',
    genre: ['History', 'Drama'],
    badge: 'Popular in Tanzania'
  }
]

export function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [inWatchlist, setInWatchlist] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  const slide = HERO_SLIDES[current]

  return (
    <div className="relative w-full h-[75vh] sm:h-[85vh] min-h-[500px] overflow-hidden bg-black pt-16">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
        style={{ backgroundImage: `url(${slide.backdrop})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-8 flex flex-col justify-end pb-12 z-10">
        <div className="max-w-2xl space-y-3 sm:space-y-4">
          
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-red-600 text-white font-bold px-3 py-1 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 mr-1 inline" />
              {slide.badge}
            </Badge>
            <span className="flex items-center text-amber-400 font-bold text-xs bg-black/60 px-2.5 py-1 rounded-lg border border-white/10">
              <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" /> {slide.rating}
            </span>
            <span className="text-gray-300 text-xs font-semibold">{slide.year}</span>
            <div className="flex gap-1.5">
              {slide.genre.map((g) => (
                <span key={g} className="text-[11px] bg-white/10 text-gray-200 px-2 py-0.5 rounded border border-white/10">
                  {g}
                </span>
              ))}
            </div>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-white uppercase leading-tight drop-shadow-md">
            {slide.title}
          </h1>

          <p className="text-gray-300 text-xs sm:text-sm line-clamp-3 leading-relaxed">
            {slide.description}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 h-12 rounded-2xl gap-2 shadow-lg shadow-red-600/40">
              <Play className="w-5 h-5 fill-white" /> Angalia Sasa
            </Button>
            
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-2xl gap-2 h-12">
              <Info className="w-5 h-5" /> Maelezo
            </Button>

            <Button 
              size="icon" 
              variant="outline" 
              className={`rounded-2xl border-white/20 h-12 w-12 ${inWatchlist ? 'bg-green-600/40 text-green-400 border-green-500' : 'bg-white/10 text-white'}`}
              onClick={() => setInWatchlist(!inWatchlist)}
            >
              {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </Button>
          </div>

        </div>

        <div className="absolute right-6 bottom-12 hidden sm:flex items-center gap-2 z-20">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${current === idx ? 'w-8 bg-red-600' : 'w-2.5 bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
