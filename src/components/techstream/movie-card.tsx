"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Plus, Info, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useWatchlistStore } from "@/stores/watchlist-store"

interface MovieCardProps {
  id: string
  title: string
  poster: string
  year: number
  rating?: number
  duration?: number
  genre?: string[]
  isNew?: boolean
  isTrending?: boolean
  isPremium?: boolean
  progress?: number
}

export function MovieCard({
  id,
  title,
  poster,
  year,
  rating,
  duration,
  genre,
  isNew = false,
  isTrending = false,
  isPremium = false,
  progress = 0,
}: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { addToWatchlist, isInWatchlist, removeFromWatchlist } = useWatchlistStore()
  const inWatchlist = isInWatchlist(id)

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inWatchlist) {
      removeFromWatchlist(id)
    } else {
      addToWatchlist({
        id,
        title,
        poster,
        type: 'movie',
        movieId: id,
        addedAt: new Date().toISOString(),
      })
    }
  }

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60)
    const minutes = mins % 60
    return `${hours}h ${minutes}m`
  }

  return (
    <Link href={`/movies/${id}`}>
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-300 bg-transparent border-0 cursor-pointer",
          isHovered && "scale-105 z-10"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0">
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-card">
            <Image
              src={poster || "/movie-placeholder.jpg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {isNew && (
                <Badge className="bg-tech-red hover:bg-tech-red">NEW</Badge>
              )}
              {isTrending && (
                <Badge className="bg-tech-blue hover:bg-tech-blue">TRENDING</Badge>
              )}
              {isPremium && (
                <Badge className="bg-yellow-500 hover:bg-yellow-500">PREMIUM</Badge>
              )}
            </div>

            {/* Rating */}
            {rating && (
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-semibold">{rating.toFixed(1)}</span>
              </div>
            )}

            {/* Hover Overlay */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-300",
                isHovered ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
                <h3 className="text-white font-semibold line-clamp-2 text-sm">{title}</h3>

                <div className="flex items-center gap-2 text-xs text-gray-300">
                  {year && <span>{year}</span>}
                  {duration && <span>• {formatDuration(duration)}</span>}
                  {rating && (
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {rating.toFixed(1)}
                    </span>
                  )}
                </div>

                {genre && genre.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {genre.slice(0, 2).map((g) => (
                      <Badge key={g} variant="secondary" className="text-xs">
                        {g}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <Button size="sm" className="flex-1 bg-tech-red hover:bg-tech-red/90">
                    <Play className="w-3 h-3 mr-1 fill-white" />
                    Play
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={handleWatchlistToggle}
                  >
                    {inWatchlist ? (
                      <>✓ List</>
                    ) : (
                      <>
                        <Plus className="w-3 h-3 mr-1" />
                        List
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {progress > 0 && (
              <div className="absolute bottom-0 left-0 right-0">
                <Progress value={progress} className="h-1" />
              </div>
            )}
          </div>

          {/* Non-hover state info */}
          {!isHovered && (
            <div className="pt-2 space-y-1">
              <h3 className="font-semibold text-sm line-clamp-1">{title}</h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {year && <span>{year}</span>}
                {progress > 0 && (
                  <span className="flex items-center gap-1 text-tech-red">
                    <Clock className="w-3 h-3" />
                    {Math.round(progress)}%
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
