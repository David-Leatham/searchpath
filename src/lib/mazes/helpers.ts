import { Block } from '../types'

export function nothin() {}

// export function generateMazeFkt(mazeAlgorithm: (height: number, width: number) => Array<Block>): (board: Board) => (SearchPath)  {
//     let retFkt: (board: Board) => (SearchPath);
//     retFkt = (board: Board) => generatePath(board, searchAlgorithm)
//     return  retFkt
//   }

export function getInnerPathArray(block: Block, height: number, width: number): null | Array<Array<Block>> {
  if ((width >= 3 && height >= 4) || (width >= 4 && height >= 3)) {
    return new Array(height-2).fill(0).map(() => new Array(width-2).fill(block))
  }
  return null
}

export function innerPathArrayAddStartFinish(grid: Array<Array<Block>>): Array<Array<Block>> {
  grid[0][0] = Block.Start
  grid[grid.length-1][grid[0].length-1] = Block.Finish
  return grid
}

export function innerPathArrayToOut(width: number, height: number, grid: Array<Array<Block>>): Array<Block> {
  for (let i=0; i<grid.length; i++) {
    grid[i].unshift(Block.BoardBoundary)
    grid[i].push(Block.BoardBoundary)
  }
  grid.unshift(new Array(width).fill(Block.BoardBoundary))
  grid.push(new Array(width).fill(Block.BoardBoundary))

  let out: Array<number> = grid.flat(1);
  return out
}



export function getRandomInt(min: number, max: number, even: boolean = false, odd: boolean = false) {
  // The maximum and the minimum are inclusive
  min = Math.ceil(min);
  max = Math.floor(max);
  if (max - min <= 1) {
    return min
  }
  // if (even || odd) {
  //   max = Math.floor(max - min);
  // } else

  let out = Math.floor(Math.random() * (max - min) + min)
  if (odd) {
    while (out % 2 == 0) {
      out = Math.floor(Math.random() * (max - min) + min)
    }
  } else if (even) {
    while (out % 2 != 0) {
      out = Math.floor(Math.random() * (max - min) + min)
    }
  }
  return out

  // return Math.floor(Math.random() * (max - min) + min); 
}