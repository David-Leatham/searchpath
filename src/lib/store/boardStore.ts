import { create } from 'zustand'
import { Block, Board, BoardState, BoardListState, BoardSizeState } from '@/lib/types'

// export const useBoardStore = create<BoardState>((set) => ({
//   board: { height:0, width:0, boardList:[]},
//   // algRunning: false,
//   // setAlgRunning: (bool: boolean) => {
//   //   set((state) => ({
//   //     algRunning: bool
//   //   }))
//   // },
//   setHeight: (height: number) => {
//     set((state) => ({
//       board: {height: height, width: state.board.width, boardList: state.board.boardList}
//     }))
//   },
//   setWidth: (width: number) => {
//     set((state) => ({
//       board: {height: state.board.height, width: width, boardList: state.board.boardList}
//     }))
//   },
//   setBoardList: (boardList: Array<Block>) => {
//     set((state) => ({
//       board: {height: state.board.height, width: state.board.width, boardList: boardList}
//     }))
//   },
// }))

export const useBoardSizeStore = create<BoardSizeState>((set) => ({
  boardSize: { height:0, width:0 },
  setHeight: (height: number) => {
    set((state) => ({
      boardSize: {height: height, width: state.boardSize.width}
    }))
  },
  setWidth: (width: number) => {
    set((state) => ({
      boardSize: {height: state.boardSize.height, width: width}
    }))
  },
}))

export const useBoardListStore = create<BoardListState>((set) => ({
  boardList: [],
  setBoardList: (boardList: Array<Block>) => {
    set((state) => ({
      boardList: boardList
    }))
  },
}))