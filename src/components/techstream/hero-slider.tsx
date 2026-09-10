'use client';

import { useState, useEffect } from 'react'
import { Play, Info, ChevronLeft, ChevronRight, Star, Sparkles, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const HERO_SLIDES = [
  {
    id: '1',
    title: 'AVATAR: THE WAY OF WATER',
    subtitle: 'Kazi mpya ya kipekee kutoka TechStream Premium',
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
    subtitle: 'Tamthilia Bora Ya Kisayansi',
    description: 'Katika jiji la technolojia ya juu la Neon City, kundi la vijana wanapambana na mashirika makubwa yanayotawala akili za watu.',
    backdrop: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600&auto=format&fit=crop',
    rating: '4.8',
    year: '2025',
    genre: ['Cyberpunk', 'Action', 'Thriller'],
    badge: 'TechStream Exclusive'
  },
  {
    id: '3',
    title: 'THE KINGDOM OF ZANJ',
    subtitle: 'Hadithi ya Kihistoria ya Afrika',
    description: 'Simulizi ya kusisimua ya ufalme wa kale wa Pwani ya Afrika Mashariki, biashara za baharini, na vita vya kutetea uhuru.',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
    rating: '5.0',
    year: '2026',
    genre: ['History', 'Drama', 'Epic'],
    badge: 'Popular in Tanzania'
  }
]

export function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [inWatchlist, setInWatchlist] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const slide = HERO_SLIDES[current]

  return (
    <div className="relative w-full h-[85vh] min-h-[550px] overflow-hidden bg-black">
      {/* Background Image na Gradient Overlays */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
        style={{ backgroundImage: `url(${slide.backdrop})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/30 to-black" />
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto h-full px-6 flex flex-col justify-end pb-16 z-10">
        <div className="max-w-2xl space-y-4 animate-fade-in">
          
          {/* Badges & Rating */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge className="bg-red-600/90 text-white font-semibold px-3 py-1 backdrop-blur-md border border-red-500/30">
              <Sparkles className="w-3.5 h-3.5 mr-1 inline" />
              {slide.badge}
            </Badge>
            <span className="flex items-center text-amber-400 font-bold text-sm bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-md border border-white/10">
              <Star className="w-4 h-4 fill-amber-400 mr-1" /> {slide.rating}
            </span>
            <span className="text-gray-300 text-sm font-medium">{slide.year}</span>
            <div className="flex gap-2">
              {slide.genre.map((g) => (
                <span key={g} className="text-xs bg-white/10 text-gray-200 px-2 py-0.5 rounded border border-white/10">
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-lg leading-tight uppercase">
            {slide.title}
          </h1>

          {/* Subtitle / Description */}
          <p className="text-gray-300 text-sm sm:text-base line-clamp-3 leading-relaxed font-normal">
            {slide.description}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-3">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 shadow-lg shadow-red-600/30 rounded-xl gap-2 transition-all hover:scale-105">
              <Play className="w-5 h-5 fill-white" /> Angalia Sasa
            </Button>
            
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md rounded-xl gap-2">
              <Info className="w-5 h-5" /> Maelezo
            </Button>

            <Button 
              size="icon" 
              variant="outline" 
              className={`rounded-xl border-white/20 backdrop-blur-md ${inWatchlist ? 'bg-green-600/30 text-green-400 border-green-500' : 'bg-white/10 text-white'}`}
              onClick={() => setInWatchlist(!inWatchlist)}
            >
              {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Carousel Indicators & Controls */}
        <div className="absolute right-6 bottom-16 hidden sm:flex items-center gap-3 z-20">
          <button 
            onClick={() => setCurrent((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-2">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${current === idx ? 'w-8 bg-red-600' : 'w-2 bg-white/30'}`}
              />
            ))}
          </div>

          <button 
            onClick={() => setCurrent((prev) => (prev + 1) % HERO_SLIDES.length)}
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  )
}
