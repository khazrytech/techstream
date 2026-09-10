'use client';

import { Navbar } from "@/components/techstream/navbar"
import { MobileBottomNav } from "@/components/techstream/mobile-bottom-nav"
import { useUIStore } from "@/stores/ui-store"
import { Play, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const mockData = [
  { id: '1', title: 'The Last of Us', type: 'series', rating: '8.8', year: '2023', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800' },
  { id: '2', title: 'Dune: Part Two', type: 'movies', rating: '8.7', year: '2024', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800' },
  { id: '3', title: 'UEFA Champions League', type: 'sports', rating: '9.2', year: '2024', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800' },
  { id: '4', title: 'BBC News Channel', type: 'live', rating: '8.5', year: '2024', image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800' },
]

export default function HomePage() {
  const { activeTab } = useUIStore()

  const filteredData = activeTab === 'home' 
    ? mockData 
    : mockData.filter(item => item.type === activeTab)

  return (
    <main className="min-h-screen bg-black text-white pb-24 pt-16">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[45vh] min-h-[320px] w-full bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-6">
        <div className="space-y-3 max-w-xl">
          <Badge className="bg-tech-red text-white uppercase tracking-wider">{activeTab}</Badge>
          <h1 className="text-2xl font-extrabold sm:text-4xl">
            {activeTab === 'home' && 'TechStream Originals'}
            {activeTab === 'movies' && 'Filamu Maarufu (Movies)'}
            {activeTab === 'series' && 'Tamthilia (Series)'}
            {activeTab === 'sports' && 'Michezo Mubashara (Sports)'}
            {activeTab === 'live' && 'Tv Mubashara (Live Stream)'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">Tazama maudhui bora ya {activeTab} katika ubora wa HD popote ulipo.</p>
          <div className="flex items-center gap-3">
            <Button className="bg-tech-red hover:bg-tech-red/90 gap-2">
              <Play className="w-4 h-4 fill-white" /> Watch Now
            </Button>
            <Button variant="secondary" className="gap-2">
              <Plus className="w-4 h-4" /> My List
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 space-y-4 mt-4">
        <h2 className="text-lg font-bold capitalize">{activeTab === 'home' ? 'Trending Now' : `${activeTab} Category`}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredData.map((item) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden bg-card/40 border border-border">
              <img src={item.image} alt={item.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform" />
              <div className="p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-tech-red font-bold uppercase">{item.type}</span>
                  <span className="text-[10px] flex items-center gap-1 text-yellow-400"><Star className="w-3 h-3 fill-yellow-400" /> {item.rating}</span>
                </div>
                <h3 className="font-semibold text-xs truncate">{item.title}</h3>
                <p className="text-[10px] text-muted-foreground">{item.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MobileBottomNav />
    </main>
  )
}
