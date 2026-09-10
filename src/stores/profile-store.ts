'use client';

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Profile {
  id: string
  name: string
  avatar?: string
}

interface ProfileState {
  currentProfile: Profile | null
  setProfile: (profile: Profile) => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      currentProfile: {
        id: '1',
        name: 'TechUser',
        avatar: '',
      },
      setProfile: (profile) => set({ currentProfile: profile }),
    }),
    {
      name: 'techstream-profile-storage',
    }
  )
)
