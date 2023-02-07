import { Block, Board, BoardState, SearchPath } from '@/lib/types'

export function generatePath(board: Board): SearchPath  {
  let start = getStart(board);
  let finish = getFinish(board);
  if (!start || !finish) {
    return {searchList: [], shortestPath: []}
  }

  let searchPath = dijkstra(start, finish, board);
  return searchPath
}

function getStart(board: Board): number | null {
  for (let i=0; i < board.boardList.length; i++) {
    if (board.boardList[i] == Block.Start) {
      return i
    }
  }
  return null
}

function getFinish(board: Board): number | null {
  for (let i=0; i < board.boardList.length; i++) {
    if (board.boardList[i] == Block.Finish) {
      return i
    }
  }
  return null
}

function dijkstra(start: number, finish: number, board: Board): SearchPath {
  // let positions = getValidNeighbours(start, board);
  let searchPath: SearchPath =  {searchList: [], shortestPath: []};
  let positions = dijkstraHelper(getValidNeighbours(start, board), searchPath, board);
  return searchPath
}

function dijkstraHelper(positionToSearch: Array<number>, searchPath: SearchPath, board: Board): boolean {
  let validPositions: Array<number> = []
  for (let position of positionToSearch) {
    if (!searchPath.searchList.includes(position)) {
      if (board.boardList[position] == Block.Finish) {
        searchPath.searchList.push(position);
        searchPath.shortestPath.push(position);
        return true
      } else {
        searchPath.searchList.push(position);
        validPositions.push(position)
      }
    }
  }
  for (let validPosition of validPositions) {
    if (dijkstraHelper(getValidNeighbours(validPosition, board), searchPath, board)) {
      searchPath.shortestPath.push(validPosition)
      return true
    }
  }
  return false
}

function getValidNeighbours(position: number, board: Board): Array<number> {
  let posibilities: Array<number> = [position-1, position+1, position+board.width, position-board.width];
  console.log(posibilities)
  let out: Array<number> = [];
  for (position of posibilities) {
    if (position >= 0 && position < board.boardList.length) {
      if (board.boardList[position] != Block.Wall) {
        out.push(position);
      }
    }
  }
  return out
}