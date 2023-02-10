import { Block, Board, BoardState, SearchPath } from '@/lib/types'
import { getValidNeighbours } from '../helpers'



export default function dijkstraWidthFirst(start: number, finish: number, board: Board): SearchPath {
  // let positions = getValidNeighbours(start, board);
  let searchPath: SearchPath =  {searchList: [], shortestPath: []};
  let positions = dijkstraWidthFirstHelper(getValidNeighbours(start, board), searchPath, board);
  return searchPath
}

function dijkstraWidthFirstHelper(positionToSearch: Array<number>, searchPath: SearchPath, board: Board): boolean {
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
    // searchPath.searchList.push(validPosition);
    if (dijkstraWidthFirstHelper(getValidNeighbours(validPosition, board), searchPath, board)) {
      searchPath.shortestPath.push(validPosition)
      return true
    }
  }
  return false
}