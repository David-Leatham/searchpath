import { Block, MazeAlgAbstract, MazeChangeBlock } from '@/lib/types'
import { getInnerArray, innerArrayAddStartFinish, innerArrayToOut, getRandomInt, flatten } from '../correctHelpers'

// From top to bottom, from left to right the grid

export default class RecursiveDivide extends MazeAlgAbstract {
  generateMaze(height: number, width: number) { return this.recursiveDivideOut(height, width)[0] }

  getMazeBase(height: number, width: number) {
    let grid = getInnerArray(Block.Path, height, width);
    if (!grid) {return []}

    this.setHeightWidth(height-2, width-2);
  
    innerArrayAddStartFinish(grid);
    return innerArrayToOut(height, width, grid)
  }
  
  getMazeChanges(height: number, width: number) { return this.recursiveDivideOut(height, width)[1] }

  recursiveDivideOut(height: number, width: number): [Array<Block>, Array<Array<MazeChangeBlock>>] {
    console.log(height, width)
    let grid = getInnerArray(Block.Path, height, width);
    if (!grid) {return [[], []]}

    this.setHeightWidth(height-2, width-2);
  
    let mazeChangeSave: Array<Array<MazeChangeBlock>> = [];
    this.recursiveDivide(grid, mazeChangeSave, 0, height-2, 0, width-2)
  
    innerArrayAddStartFinish(grid);

    let out = innerArrayToOut(height, width, grid)
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