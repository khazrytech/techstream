'use client';

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  id: string
  email: string
  name: string
  avatar: string
  plan: 'Free VIP' | 'VIP Pro' | 'Ultra 4K Stream'
  watchlist: string[]
  settings: {
    autoPlay: boolean
    hdQuality: boolean
    notifications: boolean
    language: string
  }
}

interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean
  login: (email: string, name?: string) => void
  logout: () => void
  updateProfile: (data: Partial<UserProfile>) => void
  toggleSetting: (key: keyof UserProfile['settings']) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        id: '1',
        name: 'Techboy TZ',
        email: 'techboy@techstream.tv',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop',
        plan: 'VIP Pro',
        watchlist: ['1', '2', '3'],
        settings: {
          autoPlay: true,
          hdQuality: true,
          notifications: true,
          language: 'Swahili'
        }
      },
      isAuthenticated: true,
      login: (email, name) =>
        set({
          isAuthenticated: true,
          user: {
            id: Date.now().toString(),
            email,
            name: name || email.split('@')[0],
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop',
            plan: 'Free VIP',
            watchlist: [],
            settings: { autoPlay: true, hdQuality: true, notifications: true, language: 'Swahili' }
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
        })
    }),
    {
      name: 'techstream-auth-storage'
    }
  )
)
