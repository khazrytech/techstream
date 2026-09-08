"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Plus, Info, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface HeroSlide {
  id: string
  type: 'movie' | 'series'
  title: string
  backdrop: string
  year: number
  rating: number
  genre: string[]
  duration?: number
  seasons?: number
  description: string
  isTrending?: boolean
}

interface HeroCarouselProps {
  slides: HeroSlide[]
  autoPlayInterval?: number
}

export function HeroCarousel({ slides, autoPlayInterval = 5000 }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [currentIndex, autoPlayInterval])

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % slides.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const goToSlide = (index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const currentSlide = slides[currentIndex]

  if (!currentSlide) return null

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60)
    const minutes = mins % 60
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="relative w-full aspect-[21/9] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <Image
          src={currentSlide.backdrop || "/hero-bg.png"}
          alt={currentSlide.title}
          fill
          className={cn(
            "object-cover transition-opacity duration-500",
            isTransitioning ? "opacity-50 scale-105" : "opacity-100"
          )}
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050507] via-[#050507]/50 to-transparent" />
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <Button
        variant="secondary"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity"
        onClick={nextSlide}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Content */}
      <div className="relative z-10 h-full flex items-end pb-16 md:pb-24 px-4 md:px-8 lg:px-16">
        <div className="max-w-2xl space-y-4 md:space-y-6">
          {/* Badge */}
          {currentSlide.isTrending && (
            <Badge className="bg-tech-red hover:bg-tech-red text-sm px-3 py-1">
              TRENDING NOW
            </Badge>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {currentSlide.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-sm md:text-base text-gray-200">
            <span>{currentSlide.year}</span>
            <span>•</span>
            {currentSlide.duration && <span>{formatDuration(currentSlide.duration)}</span>}
            {currentSlide.seasons && (
              <span>{currentSlide.seasons} {currentSlide.seasons === 1 ? 'Season' : 'Seasons'}</span>
            )}
            <span>•</span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {currentSlide.rating.toFixed(1)}
            </span>
            <span>•</span>
            <div className="flex flex-wrap gap-2">
              {currentSlide.genre.slice(0, 3).map((g) => (
                <Badge key={g} variant="secondary" className="text-xs">
                  {g}
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm md:text-base text-gray-300 line-clamp-3 md:line-clamp-2">
            {currentSlide.description}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              size="lg"
              className="bg-tech-red hover:bg-tech-red/90 text-white gap-2 px-8"
              asChild
            >
              <Link href={`/${currentSlide.type}s/${currentSlide.id}`}>
                <Play className="w-5 h-5 fill-white" />
                Watch Now
              </Link>
            </Button>

            <Button
              size="lg"
              variant="secondary"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white gap-2"
            >
              <Plus className="w-5 h-5" />
              My List
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-white/30 hover:bg-white/10 text-white gap-2"
              asChild
            >
              <Link href={`/${currentSlide.type}s/${currentSlide.id}`}>
                <Info className="w-5 h-5" />
                More Info
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Pagination Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              index === currentIndex
                ? "w-12 bg-tech-red"
                : "w-8 bg-white/50 hover:bg-white/70"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
