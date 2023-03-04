import { Block, Position, isEqual } from '@/lib/types'
import { getInnerPathArray, innerPathArrayAddStartFinish, innerPathArrayToOut} from '../helpers'

export default function recursiveBacktracking(height: number, width: number): Array<Block> {
  let grid = getInnerPathArray(Block.Wall, height, width);
  if (!grid) {return []}

  rBImplementatoin({heightCoord:0, widthCoord:0}, [], [], grid, height-2, width-2);

  fillSides(grid, height-2, width-2)

  innerPathArrayAddStartFinish(grid);
  return innerPathArrayToOut(width, height, grid);
}

function rBImplementatoin(position: Position, visited: Array<Position>, visitedNoNeighbors: Array<Position>, grid: Array<Array<Block>>, height: number, width: number): void {
  // console.log(position)
  let neighborsAr = neighbors(position, visited, visitedNoNeighbors, height, width);
  if (!neighborsAr.length) {
    visitedNoNeighbors.push(position)

    let newPosition = visited.pop()
    if (newPosition) {
      rBImplementatoin(newPosition, visited, visitedNoNeighbors, grid, height, width)
    }
    return 
  }

  let nextPosition = neighborsAr[Math.floor(Math.random()*neighborsAr.length)];
  walkToPosition(position, nextPosition, grid);

  visited.push(position)
  
  rBImplementatoin(nextPosition, visited, visitedNoNeighbors, grid, height, width)
}

function neighbors(position: Position, visited: Array<Position>, visitedNoNeighbors: Array<Position>, height: number, width: number): Array<Position> {
  let neighborsLi: Array<Position> = []
  if (position.heightCoord > 1) {
    neighborsLi.push({heightCoord: position.heightCoord - 2, widthCoord: position.widthCoord})
  }
  if (position.heightCoord < height - 2) {
    neighborsLi.push({heightCoord: position.heightCoord + 2, widthCoord: position.widthCoord})
  }
  if (position.widthCoord > 1) {
    neighborsLi.push({heightCoord: position.heightCoord, widthCoord: position.widthCoord - 2})
  }
  if (position.widthCoord < width - 2) {
    neighborsLi.push({heightCoord: position.heightCoord, widthCoord: position.widthCoord + 2})
  }
  // console.log(neighborsLi);
  // let tmp = [...neighborsLi];
  let i=0;
  while (i < neighborsLi.length) {
    for (let visitedPos of visited.concat(visitedNoNeighbors)) {
      // console.log(visitedPos, neighborsLi[i], isEqual(visitedPos, neighborsLi[i]))
      if (isEqual(visitedPos, neighborsLi[i])) {
        // console.log(i)
        // console.log(neighborsLi)
        neighborsLi.splice(i, 1)
        // console.log(neighborsLi)
        i -= 1
        break
      }
    }
    i += 1
  }
  // console.log(neighborsLi);
  // if (!neighborsLi.length) {
  //   for (let visitedPos of visited.concat(visitedNoNeighbors)) {
  //     console.log(visitedPos)
  //   }
  //   console.log('a')
  //   console.log(tmp)
    
  //   let i=0;
  //   while (i < tmp.length) {
  //     for (let visitedPos of visited.concat(visitedNoNeighbors)) {
  //       // console.log(visitedPos, neighborsLi[i], isEqual(visitedPos, neighborsLi[i]))
  //       if (isEqual(visitedPos, tmp[i])) {
  //         console.log(visitedPos, tmp[i])
  //         // console.log(i)
  //         // console.log(neighborsLi)
  //         tmp.splice(i, 1)
  //         // console.log(neighborsLi)
  //         i -= 1
  //         break
  //       }
  //     }
  //     i += 1
  //   }
  //   console.log(tmp)
  //   console.log('end')
  // }
  return neighborsLi
}

function fillSides(grid: Array<Array<Block>>, height: number, width: number): void {
  if (width % 2 == 0) {
    console.log('width')
    let fillPosition = 0
    while (fillPosition < width) {
      grid[fillPosition][width-1] = Block.Path
      fillPosition += 2
    }
  }
  if (height % 2 == 0) {
    console.log('height')
    let fillPosition = 0
    while (fillPosition < height) {
      grid[height-1][fillPosition] = Block.Path
      fillPosition += 2
    }
  }
}

function walkToPosition(currPos: Position, nextPos: Position, grid: Array<Array<Block>>) {
  if (currPos.heightCoord != nextPos.heightCoord) {
    if (currPos.heightCoord > nextPos.heightCoord) {
      for (let pos = currPos.heightCoord - 1; pos >= nextPos.heightCoord; pos--) {
        grid[pos][currPos.widthCoord] = Block.Path
      }
    } else {
      for (let pos = currPos.heightCoord + 1; pos <= nextPos.heightCoord; pos++) {
        grid[pos][currPos.widthCoord] = Block.Path
      }
    }
  } else if (currPos.widthCoord != nextPos.widthCoord) {
    if (currPos.widthCoord > nextPos.widthCoord) {
      for (let pos = currPos.widthCoord - 1; pos >= nextPos.widthCoord; pos--) {
        grid[currPos.heightCoord][pos] = Block.Path
      }
    } else {
      for (let pos = currPos.widthCoord + 1; pos <= nextPos.widthCoord; pos++) {
        grid[currPos.heightCoord][pos] = Block.Path
      }
    }
  }
}