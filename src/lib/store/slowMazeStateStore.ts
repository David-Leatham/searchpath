import { create } from 'zustand'
import { SlowMazeState } from '@/lib/types'

export const useSlowMazeStateStore = create<SlowMazeState>((set) => ({
  slowMazeState: false,
  toggleSlowMazeState: () => {
    set((state) => ({
        slowMazeState: !state.slowMazeState
    }))
  },
}))