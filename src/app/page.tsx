"use client"

import { Navbar } from "@/components/techstream/navbar"
import { MobileBottomNav } from "@/components/techstream/mobile-bottom-nav"
import { HeroCarousel } from "@/components/techstream/hero-carousel"
import { ContentRow } from "@/components/techstream/content-row"
import { MovieCard } from "@/components/techstream/movie-card"
import { SeriesCard } from "@/components/techstream/series-card"
import {
  heroSlides,
  movies,
  series,
  continueWatching,
  africanMovies,
} from "@/lib/sample-data"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 pb-20 md:pb-0">
        {/* Hero Carousel */}
        <HeroCarousel slides={heroSlides} />

        {/* Content Sections */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 -mt-20 relative z-10 space-y-8">
          {/* Continue Watching */}
          {continueWatching.length > 0 && (
            <ContentRow title="Continue Watching">
              {continueWatching.map((item) => (
                <div key={item.id} className="flex-none w-[160px] md:w-[200px]">
                  {item.type === 'series' ? (
                    <SeriesCard {...item} />
                  ) : (
                    <MovieCard {...item} />
                  )}
                </div>
              ))}
            </ContentRow>
          )}

          {/* Trending Now */}
          <ContentRow title="Trending Now" seeAllHref="/trending">
            {[...movies.slice(0, 3), ...series.slice(0, 3)].map((item) => (
              <div key={item.id} className="flex-none w-[160px] md:w-[200px]">
                {('seasons' in item) ? (
                  <SeriesCard {...item} />
                ) : (
                  <MovieCard {...item} />
                )}
              </div>
            ))}
          </ContentRow>

          {/* Latest Movies */}
          <ContentRow title="Latest Movies" seeAllHref="/movies?sort=latest">
            {movies.slice(0, 6).map((movie) => (
              <div key={movie.id} className="flex-none w-[160px] md:w-[200px]">
                <MovieCard {...movie} />
              </div>
            ))}
          </ContentRow>

          {/* Popular Series */}
          <ContentRow title="Popular Series" seeAllHref="/series?sort=popular">
            {series.slice(0, 6).map((seriesItem) => (
              <div key={seriesItem.id} className="flex-none w-[160px] md:w-[200px]">
                <SeriesCard {...seriesItem} />
              </div>
            ))}
          </ContentRow>

          {/* African Movies */}
          <ContentRow title="African Movies" seeAllHref="/movies?region=africa">
            {africanMovies.map((movie) => (
              <div key={movie.id} className="flex-none w-[160px] md:w-[200px]">
                <MovieCard {...movie} />
              </div>
            ))}
          </ContentRow>

          {/* TechStream Originals */}
          <ContentRow title="TechStream Originals" seeAllHref="/originals">
            {series.filter(s => s.isOriginal).map((seriesItem) => (
              <div key={seriesItem.id} className="flex-none w-[160px] md:w-[200px]">
                <SeriesCard {...seriesItem} />
              </div>
            ))}
          </ContentRow>

          {/* Top Rated */}
          <ContentRow title="Top Rated" seeAllHref="/top-rated">
            {[...movies, ...series]
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 6)
              .map((item) => (
                <div key={item.id} className="flex-none w-[160px] md:w-[200px]">
                  {('seasons' in item) ? (
                    <SeriesCard {...item} />
                  ) : (
                    <MovieCard {...item} />
                  )}
                </div>
              ))}
          </ContentRow>

          {/* Recommended For You */}
          <ContentRow title="Recommended For You">
            {[...movies.slice(3), ...series.slice(3)].slice(0, 6).map((item) => (
              <div key={item.id} className="flex-none w-[160px] md:w-[200px]">
                {('seasons' in item) ? (
                  <SeriesCard {...item} />
                ) : (
                  <MovieCard {...item} />
                )}
              </div>
            ))}
          </ContentRow>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Footer */}
      <footer className="bg-oled-dark border-t border-border mt-12 py-8 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">TechStream</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Devices</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Accessibility</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Copyright</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">YouTube</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 TechStream. All rights reserved.</p>
            <p className="mt-2">Stream Everything. Experience More.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
