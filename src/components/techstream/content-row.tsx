"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ContentRowProps {
  title: string
  seeAllHref?: string
  children: React.ReactNode
  className?: string
}

export function ContentRow({ title, seeAllHref, children, className }: ContentRowProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollContainerRef = useState<HTMLDivElement | null>(null)[0]

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef) return

    const scrollAmount = 600
    const newScrollPosition =
      direction === 'left'
        ? scrollContainerRef.scrollLeft - scrollAmount
        : scrollContainerRef.scrollLeft + scrollAmount

    scrollContainerRef.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth',
    })
  }

  const handleScroll = () => {
    if (!scrollContainerRef) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
  }

  return (
    <section className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-0">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        {seeAllHref && (
          <Button variant="ghost" size="sm" asChild>
            <a href={seeAllHref} className="gap-2">
              See All
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        )}
      </div>

      {/* Content Scroll Container */}
      <div className="relative group">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 hover:bg-black/90 backdrop-blur-sm"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto pb-4 px-4 md:px-0 hide-scrollbar snap-x snap-mandatory"
        >
          {children}
        </div>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 hover:bg-black/90 backdrop-blur-sm"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        )}
      </div>
    </section>
  )
}
