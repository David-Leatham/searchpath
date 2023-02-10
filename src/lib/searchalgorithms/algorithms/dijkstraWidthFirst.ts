import { Block, Board, BoardState, SearchPath } from '@/lib/types'
import { getValidNeighbours } from '../helpers'



export default function dijkstraWidthFirst(start: number, finish: number, board: Board): SearchPath {
  let searchList: Array<number> = [];
  let shortestPath: Array<number> = [];

  let neighbors: Array<number> = getValidNeighbours(start, board);
  let moves: Array<Array<number>> = [];
  let finished: boolean = false;
  searchList.push(start);
  let pastList: Array<Array<number>> = [...neighbors].map(neighbor => [start, neighbor]);
  pastList.push([start, start]);

  while (neighbors.length > 0) {
    let nextBlock = neighbors.shift()
    if (nextBlock) { // Just for ts..
      for (let move of pastList) {
        if (move[1] == nextBlock) {
          moves.push([move[0], nextBlock])
        }
      }
      // finish.
      // moves.push([nextBlock, newBlock]);
      // nextBlock = newBlock;
      searchList.push(nextBlock);
      if (board.boardList[nextBlock] == Block.Finish) {
        finished = true;
        break
      }
      for (let neighbor of getValidNeighbours(nextBlock, board)) {
        	if (!(neighbors.includes(neighbor)) && !(searchList.includes(neighbor))) {
            pastList.push([nextBlock, neighbor])
            neighbors.push(neighbor)
          }
      }
    } else {
      break
    }
  }
  if (finished) {
    let currentBlock = finish;
    shortestPath.push(currentBlock);
    while (currentBlock != start) {
      for (let move of moves) {
        if (move[1] == currentBlock) {
          currentBlock = move[0]
          shortestPath.push(currentBlock)
          break
        }
      }
    }
  }
  let searchPath: SearchPath =  {searchList: searchList, shortestPath: shortestPath};
  return searchPath
}