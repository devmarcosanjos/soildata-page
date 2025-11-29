import { create } from 'zustand';

interface UIState {
  // Platform leftbar
  isMinimized: boolean;
  setIsMinimized: (minimized: boolean) => void;

  // Left menu active tab
  activeTab: string | number;
  setActiveTab: (tab: string | number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isMinimized: false,
  activeTab: 'themes',

  // Actions
  setIsMinimized: (minimized) => set({ isMinimized: minimized }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

