import { create } from 'zustand'
import { MazeAlgorithmState, MazeAlgorithm } from '@/lib/types'
import mazeAlgorithmInfoList from '@/lib/mazes/mazeAlgorithms'

export const useMazeAlgorithmsStore = create<MazeAlgorithmState>((set) => ({
  mazeAlgorithm: mazeAlgorithmInfoList[0].mazeAlgorithm,
  mazeAlgorithmInfoList: mazeAlgorithmInfoList,
  setMazeAlorithm: (mazeAlg: MazeAlgorithm) => {
    set((state) => ({
      mazeAlgorithm: mazeAlg
    }))
  },
}))