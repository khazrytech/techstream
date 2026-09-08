import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WatchlistItem {
  id: string;
  movieId?: string;
  seriesId?: string;
  title: string;
  poster: string;
  type: 'movie' | 'series';
  addedAt: string;
}

export interface WatchlistState {
  watchlist: WatchlistItem[];
  favorites: WatchlistItem[];
  watchHistory: any[];
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (id: string) => void;
  addToFavorites: (item: WatchlistItem) => void;
  removeFromFavorites: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
  isInFavorites: (id: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      favorites: [],
      watchHistory: [],
      addToWatchlist: (item) =>
        set((state) => {
          if (state.watchlist.some((i) => i.id === item.id)) {
            return state;
          }
          return { watchlist: [...state.watchlist, item] };
        }),
      removeFromWatchlist: (id) =>
        set((state) => ({
          watchlist: state.watchlist.filter((i) => i.id !== id),
        })),
      addToFavorites: (item) =>
        set((state) => {
          if (state.favorites.some((i) => i.id === item.id)) {
            return state;
          }
          return { favorites: [...state.favorites, item] };
        }),
      removeFromFavorites: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((i) => i.id !== id),
        })),
      isInWatchlist: (id) => get().watchlist.some((i) => i.id === id),
      isInFavorites: (id) => get().favorites.some((i) => i.id === id),
    }),
    {
      name: 'techstream-watchlist',
    }
  )
);
