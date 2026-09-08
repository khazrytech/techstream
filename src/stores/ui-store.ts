import { create } from 'zustand';

type TabType = 'home' | 'movies' | 'series' | 'sports' | 'live' | 'search' | 'mylist' | 'profile';

export interface UIState {
  activeTab: TabType;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isSidebarOpen: boolean;
  setActiveTab: (tab: TabType) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  toggleSearch: () => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'home',
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isSidebarOpen: false,
  setActiveTab: (activeTab) => set({ activeTab }),
  setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
  setSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleSearch: () =>
    set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
