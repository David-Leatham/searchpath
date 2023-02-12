import { Block, Board, SearchPath } from '@/lib/types';

export function generatePathFkt(searchAlgorithm: (start: number, finish: number, board: Board) => SearchPath): (board: Board) => (SearchPath)  {
  let retFkt: (board: Board) => (SearchPath);
  retFkt = (board: Board) => generatePath(board, searchAlgorithm)
  return  retFkt
}

export function generatePath(board: Board, searchAlgorithm: (start: number, finish: number, board: Board) => SearchPath): SearchPath  {
  let start = getStart(board);
  let finish = getFinish(board);
  if (!start || !finish) {
    return {searchList: [], shortestPath: []}
  }

  let searchPath = searchAlgorithm(start, finish, board);
  return searchPath
}

export function getStart(board: Board): number | null {
  for (let i=0; i < board.boardList.length; i++) {
    if (board.boardList[i] == Block.Start) {
      return i
    }
  }
  return null
}

export function getFinish(board: Board): number | null {
  for (let i=0; i < board.boardList.length; i++) {
    if (board.boardList[i] == Block.Finish) {
      return i
    }
  }
  return null
}

export function getValidNeighbours(position: number, board: Board): Array<number> {
  let posibilities: Array<number> = [position-1, position+1, position+board.width, position-board.width];
  let out: Array<number> = [];
  for (position of posibilities) {
    if (position >= 0 && position < board.boardList.length) {
      if (board.boardList[position] != Block.Wall && board.boardList[position] != Block.BoardBoundary) {
        out.push(position);
      }
    }
  }
  return out
}

