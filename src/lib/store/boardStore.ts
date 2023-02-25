import { create } from 'zustand'
import { Block, Board, BoardState } from '@/lib/types'

export const useBoardStore = create<BoardState>((set) => ({
  board: { height:0, width:0, boardList:[]},
  algRunning: false,
  setAlgRunning: (bool: boolean) => {
    set((state) => ({
      algRunning: bool
    }))
  },
  setHeight: (height: number) => {
    set((state) => ({
      board: {height: height, width: state.board.width, boardList: state.board.boardList}
    }))
  },
  setWidth: (width: number) => {
    set((state) => ({
      board: {height: state.board.height, width: width, boardList: state.board.boardList}
    }))
  },
  setBoardList: (boardList: Array<Block>) => {
    set((state) => ({
      board: {height: state.board.height, width: state.board.width, boardList: boardList}
    }))
  },
}))