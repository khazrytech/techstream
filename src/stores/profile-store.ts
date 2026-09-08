import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Profile {
  id: string;
  name: string;
  avatar?: string;
  isKids: boolean;
  pin?: string;
}

export interface ProfileState {
  profiles: Profile[];
  currentProfile: Profile | null;
  isLoading: boolean;
  setProfiles: (profiles: Profile[]) => void;
  setCurrentProfile: (profile: Profile) => void;
  addProfile: (profile: Profile) => void;
  updateProfile: (id: string, profile: Partial<Profile>) => void;
  removeProfile: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profiles: [],
      currentProfile: null,
      isLoading: false,
      setProfiles: (profiles) => set({ profiles }),
      setCurrentProfile: (currentProfile) => set({ currentProfile }),
      addProfile: (profile) =>
        set((state) => ({ profiles: [...state.profiles, profile] })),
      updateProfile: (id, updatedProfile) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id ? { ...p, ...updatedProfile } : p
          ),
          currentProfile:
            state.currentProfile?.id === id
              ? { ...state.currentProfile, ...updatedProfile }
              : state.currentProfile,
        })),
      removeProfile: (id) =>
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== id),
          currentProfile: state.currentProfile?.id === id ? null : state.currentProfile,
        })),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'techstream-profiles',
      partialize: (state) => ({
        profiles: state.profiles,
        currentProfile: state.currentProfile,
      }),
    }
  )
);
