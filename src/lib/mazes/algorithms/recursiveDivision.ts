import { Block, MazeAlgAbstract, MazeChangeBlock, Position } from '@/lib/types'
import { getInnerPathArray, innerPathArrayAddStartFinish, innerPathArrayToOut, getRandomInt } from '../helpers'

// From top to bottom, from left to right the grid

export default class RecursiveDivide extends MazeAlgAbstract {
  generateMaze(height: number, width: number) { return this.recursiveDivideOut(height, width)[0] }
  getMazeBase(width: number, height: number) {
    // let grid = getInnerPathArray(Block.Path, height, width);
    let grid: null | Array<Array<Block>> = null
    if ((width >= 3 && height >= 4) || (width >= 4 && height >= 3)) {
      grid = new Array(width-2).fill(0).map(() => new Array(height-2).fill(Block.Path))
    }
    if (!grid) {return []}

    this.setHeightWidth(height-2, width-2);
  
    // let mazeChangeSave: Array<Array<MazeChangeBlock>> = [];
    // this.recursiveDivide(grid, mazeChangeSave, 0, height-2, 0, width-2)
  
    // innerPathArrayAddStartFinish(grid);
    grid[0][0] = Block.Start;
    grid[grid.length-1][grid[0].length-1] = Block.Finish

    // let out = innerPathArrayToOut(width, height, grid)
    
    for (let i=0; i<grid.length; i++) {
      grid[i].unshift(Block.BoardBoundary)
      grid[i].push(Block.BoardBoundary)
    }
    grid.unshift(new Array(height).fill(Block.BoardBoundary))
    grid.push(new Array(height).fill(Block.BoardBoundary))

    return grid.flat(1);
  }
  getMazeChanges(height: number, width: number) { return this.recursiveDivideOut(height, width)[1] }

  recursiveDivideOut(width: number, height: number): [Array<Block>, Array<Array<MazeChangeBlock>>] {
    // let grid = getInnerPathArray(Block.Path, height, width);
    let grid: null | Array<Array<Block>> = null
    if ((width >= 3 && height >= 4) || (width >= 4 && height >= 3)) {
      grid = new Array(width-2).fill(0).map(() => new Array(height-2).fill(Block.Path))
    }
    if (!grid) {return [[], []]}

    this.setHeightWidth(height-2, width-2);
  
    let mazeChangeSave: Array<Array<MazeChangeBlock>> = [];
    this.recursiveDivide(grid, mazeChangeSave, 0, height-2, 0, width-2)
  
    // innerPathArrayAddStartFinish(grid);
    grid[0][0] = Block.Start;
    grid[grid.length-1][grid[0].length-1] = Block.Finish

    // let out = innerPathArrayToOut(width, height, grid)
    
    for (let i=0; i<grid.length; i++) {
      grid[i].unshift(Block.BoardBoundary)
      grid[i].push(Block.BoardBoundary)
    }
    grid.unshift(new Array(height).fill(Block.BoardBoundary))
    grid.push(new Array(height).fill(Block.BoardBoundary))

    let out: Array<number> = grid.flat(1);
    return [out, mazeChangeSave];
  }

  recursiveDivide(grid: Array<Array<Block>>, mazeChangeSave: Array<Array<MazeChangeBlock>>, heightLowerBound: number, heightUpperBound: number, widthLowerBound: number, widthUpperBound: number) {
    if (!(heightUpperBound - heightLowerBound >= 2 && widthUpperBound - widthLowerBound >= 2 && heightUpperBound - heightLowerBound + widthUpperBound - widthLowerBound >= 5)) {
      return
    }
  
    let horizontal: boolean;
    if (heightUpperBound - heightLowerBound == widthUpperBound - widthLowerBound) {
      horizontal = true;
    } else if (heightUpperBound - heightLowerBound < widthUpperBound - widthLowerBound) {
      horizontal = false;
    } else {
      horizontal = true;
    }
  
    if (horizontal) {
      let borderHeight = getRandomInt(heightLowerBound+1, heightUpperBound-1, false, true)
      let borderHole = getRandomInt(widthLowerBound, widthUpperBound, true, false)
      let mazeSave: Array<MazeChangeBlock> = [];
      for (let i=widthLowerBound; i<widthUpperBound; i++) {
        if (i != borderHole) {
          grid[i][borderHeight] = Block.Wall;
          mazeSave.push({block: Block.Wall, position: flatten({heightCoord: borderHeight, widthCoord: i}, this.width, this.height)})
        }
      }
      mazeChangeSave.push(mazeSave);
      this.recursiveDivide(grid, mazeChangeSave, heightLowerBound, borderHeight, widthLowerBound, widthUpperBound);
      this.recursiveDivide(grid, mazeChangeSave, borderHeight+1, heightUpperBound, widthLowerBound, widthUpperBound);
    } else {
      let borderWidth = getRandomInt(widthLowerBound+1, widthUpperBound-1, false, true)
      let borderHole = getRandomInt(heightLowerBound, heightUpperBound, true, false)
      let mazeSave: Array<MazeChangeBlock> = [];
      for (let i=heightLowerBound; i<heightUpperBound; i++) {
        if (i != borderHole) {
          grid[borderWidth][i] = Block.Wall;
          mazeSave.push({block: Block.Wall, position: flatten({heightCoord: i, widthCoord: borderWidth}, this.width, this.height)})
        }
      }
      mazeChangeSave.push(mazeSave);
      this.recursiveDivide(grid, mazeChangeSave, heightLowerBound, heightUpperBound, widthLowerBound, borderWidth);
      this.recursiveDivide(grid, mazeChangeSave, heightLowerBound, heightUpperBound, borderWidth+1, widthUpperBound);
    }
  }
}


export function flatten(position: Position, height: number, width: number): number {
  return (width + 2) * (position.widthCoord + 1) +   (position.heightCoord + 1)
}