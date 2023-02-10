import { create } from 'zustand'
import { Block, Board, SearchAlgorithmState, SearchAlgorithm } from '@/lib/types'
import searchAlgorithmInfoList from '@/lib/searchalgorithms/searchAlgorithms'

export const useSearchAlgorithmsStore = create<SearchAlgorithmState>((set) => ({
  searchAlgorithm: searchAlgorithmInfoList[0].searchAlgorithm,
  searchAlgorithmInfoList: searchAlgorithmInfoList,
  setSearchAlorithm: (searchAlg: SearchAlgorithm) => {
    set((state) => ({
      searchAlgorithm: searchAlg
    }))
  },
}))