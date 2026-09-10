'use client';

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  id: string
  email: string
  name: string
  phone: string
  avatar: string
  plan: 'Free VIP' | 'VIP Pro' | 'Ultra 4K Stream'
  stats: {
    hoursWatched: number
    moviesCompleted: number
    watchlistCount: number
  }
  watchlist: Array<{ id: string; title: string; image: string; category: string; rating: string }>
  history: Array<{ id: string; title: string; image: string; progress: number; duration: string }>
  devices: Array<{ id: string; name: string; type: string; lastActive: string; current: boolean }>
  settings: {
    autoPlay: boolean
    videoQuality: '4K Ultra HD' | '1080p Full HD' | '720p Data Saver'
    notifications: boolean
    downloadWifiOnly: boolean
    language: 'Swahili' | 'English'
    parentalPin: string
  }
}

interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean
  login: (email: string, name?: string) => void
  logout: () => void
  updateProfile: (data: Partial<UserProfile>) => void
  toggleSetting: (key: keyof UserProfile['settings']) => void
  setVideoQuality: (quality: UserProfile['settings']['videoQuality']) => void
  removeFromWatchlist: (id: string) => void
  removeDevice: (id: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        id: '1',
        name: 'Techboy TZ',
        email: 'hackertrick1997@gmail.com',
        phone: '+255 712 345 678',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop',
        plan: 'VIP Pro',
        stats: {
          hoursWatched: 142,
          moviesCompleted: 38,
          watchlistCount: 12
        },
        watchlist: [
          { id: '1', title: 'Cyberpunk 2088', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop', category: 'Sci-Fi', rating: '4.8' },
          { id: '2', title: 'The Kingdom of Zanj', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop', category: 'Action', rating: '5.0' },
          { id: '3', title: 'Avatar: Way of Water', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop', category: 'Adventure', rating: '4.9' },
        ],
        history: [
          { id: '1', title: 'Avatar: The Way of Water', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop', progress: 75, duration: '2h 15m left' },
          { id: '2', title: 'Cyberpunk 2088 Episode 4', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop', progress: 30, duration: '40m left' },
        ],
        devices: [
          { id: 'dev-1', name: 'Samsung Galaxy A54 (Simu Hii)', type: 'Mobile App', lastActive: 'Sasa Hivi', current: true },
          { id: 'dev-2', name: 'LG Smart TV 55"', type: 'Smart TV', lastActive: 'Jana, 21:40', current: false },
          { id: 'dev-3', name: 'Chrome Browser (Windows)', type: 'Web Browser', lastActive: 'Siku 3 zilizopita', current: false },
        ],
        settings: {
          autoPlay: true,
          videoQuality: '4K Ultra HD',
          notifications: true,
          downloadWifiOnly: true,
          language: 'Swahili',
          parentalPin: '1234'
        }
      },
      isAuthenticated: true,
      login: (email, name) =>
        set({
          isAuthenticated: true,
          user: {
            id: Date.now().toString(),
            email,
            phone: '',
            name: name || email.split('@')[0],
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop',
            plan: 'Free VIP',
            stats: { hoursWatched: 0, moviesCompleted: 0, watchlistCount: 0 },
            watchlist: [],
            history: [],
            devices: [{ id: 'dev-1', name: 'Android Device', type: 'Mobile', lastActive: 'Sasa Hivi', current: true }],
            settings: { autoPlay: true, videoQuality: '1080p Full HD', notifications: true, downloadWifiOnly: true, language: 'Swahili', parentalPin: '0000' }
          }
        }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null
        })),
      toggleSetting: (key) =>
        set((state) => {
          if (!state.user) return state
          return {
            user: {
              ...state.user,
              settings: {
                ...state.user.settings,
                [key]: !state.user.settings[key]
              }
            }
          }
        }),
      setVideoQuality: (quality) =>
        set((state) => {
          if (!state.user) return state
          return {
            user: {
              ...state.user,
              settings: { ...state.user.settings, videoQuality: quality }
            }
          }
        }),
      removeFromWatchlist: (id) =>
        set((state) => {
          if (!state.user) return state
          return {
            user: {
              ...state.user,
              watchlist: state.user.watchlist.filter((item) => item.id !== id)
            }
          }
        }),
      removeDevice: (id) =>
        set((state) => {
          if (!state.user) return state
          return {
            user: {
              ...state.user,
              devices: state.user.devices.filter((dev) => dev.id !== id)
            }
          }
        })
    }),
    {
      name: 'techstream-auth-storage'
    }
  )
)
