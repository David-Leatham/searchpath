import { create } from 'zustand';
import { GenerateMazeState } from '@/lib/types';

export const useGenerateMazeStateStore = create<GenerateMazeState>((set) => ({
  generateMazeState: false,
  toggleGenerateMazeState: () => {
    set((state) => ({
      generateMazeState: !state.generateMazeState
    }))
  },
}))