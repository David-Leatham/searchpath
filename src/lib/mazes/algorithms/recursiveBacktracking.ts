import { Block, Position, isEqual, MazeAlgAbstract, MazeChangeBlock } from '@/lib/types'
import { getInnerPathArray, innerPathArrayAddStartFinish, innerPathArrayToOut, flatten } from '../helpers'
import { getInnerArray, innerArrayAddStartFinish, innerArrayToOut, neighbors   } from '../correctHelpers'


export default class RecursiveBacktracking extends MazeAlgAbstract {
  generateMaze(height: number, width: number) { return this.recursiveBacktracking(height, width)[0] }
  getMazeBase(height: number, width: number) {
    let grid = getInnerArray(Block.Wall, height, width);
    if (!grid) {return []}

    innerArrayAddStartFinish(grid);
    return innerArrayToOut(height, width, grid);
  }
  getMazeChanges(height: number, width: number) { return this.recursiveBacktracking(height, width)[1] }

  recursiveBacktracking(height: number, width: number): [Array<Block>, Array<Array<MazeChangeBlock>>] {
    let heightSave = height
    height = width
    width = heightSave

    let grid = getInnerPathArray(Block.Wall, height, width);
    if (!grid) {return [[], []]}
  
    let mazeChanges: Array<Array<MazeChangeBlock>> = []
    this.rBImplementatoin({heightCoord:0, widthCoord:0}, [], [], mazeChanges, grid, height-2, width-2);
  
    fillSides(grid, height-2, width-2)
  
    innerPathArrayAddStartFinish(grid);
    return [innerPathArrayToOut(width, height, grid), mazeChanges];
  }

  rBImplementatoin(position: Position, visited: Array<Position>, visitedNoNeighbors: Array<Position>, mazeChanges: Array<Array<MazeChangeBlock>>, grid: Array<Array<Block>>, height: number, width: number): void {
    let neighborsAr = neighbors(position, visited.concat(visitedNoNeighbors), height, width);
    if (!neighborsAr.length) {
      visitedNoNeighbors.push(position)

      let newPosition = visited.pop()
      if (newPosition) {
        walkBackFromPosition(position, newPosition, mazeChanges, grid, height, width);
        this.rBImplementatoin(newPosition, visited, visitedNoNeighbors, mazeChanges, grid, height, width)
      } else {
        mazeChanges.push([{block: Block.Path, position: flatten(position, height, width)}])
      }
      return 
    }
  
    let nextPosition = neighborsAr[Math.floor(Math.random()*neighborsAr.length)];
    walkToPosition(position, nextPosition, mazeChanges, grid, height, width);
  
    visited.push(position)
    
    this.rBImplementatoin(nextPosition, visited, visitedNoNeighbors, mazeChanges, grid, height, width)
  }
}

// function neighbors(position: Position, visited: Array<Position>, visitedNoNeighbors: Array<Position>, height: number, width: number): Array<Position> {
//   let neighborsLi: Array<Position> = []
//   if (position.heightCoord > 1) {
//     neighborsLi.push({heightCoord: position.heightCoord - 2, widthCoord: position.widthCoord})
//   }
//   if (position.heightCoord < height - 2) {
//     neighborsLi.push({heightCoord: position.heightCoord + 2, widthCoord: position.widthCoord})
//   }
//   if (position.widthCoord > 1) {
//     neighborsLi.push({heightCoord: position.heightCoord, widthCoord: position.widthCoord - 2})
//   }
//   if (position.widthCoord < width - 2) {
//     neighborsLi.push({heightCoord: position.heightCoord, widthCoord: position.widthCoord + 2})
//   }

//   let i=0;
//   while (i < neighborsLi.length) {
//     for (let visitedPos of visited.concat(visitedNoNeighbors)) {
//       if (isEqual(visitedPos, neighborsLi[i])) {
//         neighborsLi.splice(i, 1)
//         i -= 1
//         break
//       }
//     }
//     i += 1
//   }
//   return neighborsLi
// }

function fillSides(grid: Array<Array<Block>>, height: number, width: number): void {
  if (width % 2 == 0) {
    let fillPosition = 0
    while (fillPosition < height) {
      grid[fillPosition][width-1] = Block.Path
      fillPosition += 2
    }
  }
  if (height % 2 == 0) {
    let fillPosition = 0
    while (fillPosition < width) {
      grid[height-1][fillPosition] = Block.Path
      fillPosition += 2
    }
  }
}

function walkToPosition(currPos: Position, nextPos: Position, mazeChanges: Array<Array<MazeChangeBlock>>, grid: Array<Array<Block>>, height: number, width: number) {
  if (currPos.heightCoord != nextPos.heightCoord) {
    if (currPos.heightCoord > nextPos.heightCoord) {
      for (let pos = currPos.heightCoord - 1; pos >= nextPos.heightCoord; pos--) {
        grid[pos][currPos.widthCoord] = Block.Path
        mazeChanges.push([{block: Block.AlgSaving, position: flatten({heightCoord: pos, widthCoord: currPos.widthCoord}, height, width)}])
      }
    } else {
      for (let pos = currPos.heightCoord + 1; pos <= nextPos.heightCoord; pos++) {
        grid[pos][currPos.widthCoord] = Block.Path
        mazeChanges.push([{block: Block.AlgSaving, position: flatten({heightCoord: pos, widthCoord: currPos.widthCoord}, height, width)}])
      }
    }
  } else if (currPos.widthCoord != nextPos.widthCoord) {
    if (currPos.widthCoord > nextPos.widthCoord) {
      for (let pos = currPos.widthCoord - 1; pos >= nextPos.widthCoord; pos--) {
        grid[currPos.heightCoord][pos] = Block.Path
        mazeChanges.push([{block: Block.AlgSaving, position: flatten({heightCoord: currPos.heightCoord, widthCoord: pos}, height, width)}])
      }
    } else {
      for (let pos = currPos.widthCoord + 1; pos <= nextPos.widthCoord; pos++) {
        grid[currPos.heightCoord][pos] = Block.Path
        mazeChanges.push([{block: Block.AlgSaving, position: flatten({heightCoord: currPos.heightCoord, widthCoord: pos}, height, width)}])
      }
    }
  }
}

function walkBackFromPosition(currPos: Position, nextPos: Position, mazeChanges: Array<Array<MazeChangeBlock>>, grid: Array<Array<Block>>, height: number, width: number) {
  if (currPos.heightCoord != nextPos.heightCoord) {
    if (currPos.heightCoord > nextPos.heightCoord) {
      for (let pos = currPos.heightCoord; pos > nextPos.heightCoord; pos--) {
        grid[pos][currPos.widthCoord] = Block.Path
        mazeChanges.push([{block: Block.Path, position: flatten({heightCoord: pos, widthCoord: currPos.widthCoord}, height, width)}])
      }
    } else {
      for (let pos = currPos.heightCoord; pos < nextPos.heightCoord; pos++) {
        grid[pos][currPos.widthCoord] = Block.Path
        mazeChanges.push([{block: Block.Path, position: flatten({heightCoord: pos, widthCoord: currPos.widthCoord}, height, width)}])
      }
    }
  } else if (currPos.widthCoord != nextPos.widthCoord) {
    if (currPos.widthCoord > nextPos.widthCoord) {
      for (let pos = currPos.widthCoord; pos > nextPos.widthCoord; pos--) {
        grid[currPos.heightCoord][pos] = Block.Path
        mazeChanges.push([{block: Block.Path, position: flatten({heightCoord: currPos.heightCoord, widthCoord: pos}, height, width)}])
      }
    } else {
      for (let pos = currPos.widthCoord; pos < nextPos.widthCoord; pos++) {
        grid[currPos.heightCoord][pos] = Block.Path
        mazeChanges.push([{block: Block.Path, position: flatten({heightCoord: currPos.heightCoord, widthCoord: pos}, height, width)}])
      }
    }
  }
}