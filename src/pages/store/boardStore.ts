import { create } from 'zustand'

export interface Board {
  height: number;
  width: number;
  board: Array<boolean>;
}

export interface BoardState {
  board: Board;
  setHeight: (height: number) => void;
  setWidth: (width: number) => void;
  setBoard: (board: Array<boolean>) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  board: { height:0, width:0, board:[] },
  setHeight: (height: number) => {
    set((state) => ({
      board: {height: height, width: state.board.width, board: state.board.board}
    }))
  },
  setWidth: (width: number) => {
    set((state) => ({
      board: {height: state.board.height, width: width, board: state.board.board}
    }))
  },
  setBoard: (board: Array<boolean>) => {
    set((state) => ({
      board: {height: state.board.height, width: state.board.width, board: board}
    }))
  },
}))