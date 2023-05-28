import { Block, MazeAlgAbstract, MazeChangeBlock, Position } from '@/lib/types'
import { getInnerArray, innerArrayAddStartFinish, innerArrayToOut, flatten, neighbors, visitedNeighbors, fillSides } from '../helpers'

// From top to bottom, from left to right the grid

export default class AldousBorder extends MazeAlgAbstract {
  generateMaze(height: number, width: number) { return this.randomizedPrimOut(height, width)[0] }

  getMazeBase(height: number, width: number) {
    let grid = getInnerArray(Block.Wall, height, width);
    if (!grid) {return []}

    this.setHeightWidth(height-2, width-2);
  
    innerArrayAddStartFinish(grid);
    return innerArrayToOut(height, width, grid)
  }
  
  getMazeChanges(height: number, width: number) { return this.randomizedPrimOut(height, width)[1] }

  randomizedPrimOut(height: number, width: number): [Array<Block>, Array<Array<MazeChangeBlock>>] {
    let grid = getInnerArray(Block.Wall, height, width);
    if (!grid) {return [[], []]}

    this.setHeightWidth(height-2, width-2);
  
    let mazeChangeSave: Array<Array<MazeChangeBlock>> = [];
    this.randomizedPrim(grid, mazeChangeSave, height-2, width-2)

  
    innerArrayAddStartFinish(grid);


    let out = innerArrayToOut(height, width, grid)
    return [out, mazeChangeSave];
  }

  randomizedPrim(grid: Array<Array<Block>>, mazeChangeSave: Array<Array<MazeChangeBlock>>, height: number, width: number) {
    if (!(height >= 2 && width >= 2 && height + width >= 5)) {
      return
    }

    let paths: Array<Position> = [];
    let walls: Array<Position> = [];

    let firstPosition: Position = this.getRandomFirstPosition(height, width);
    
    grid[firstPosition.heightCoord][firstPosition.widthCoord] = Block.Path;
    paths.push(firstPosition);

    mazeChangeSave.push([{block: Block.Path, position: flatten(firstPosition, this.height, this.width)}])
    
    let mazeChanges: Array<MazeChangeBlock> = [];
    let neighborsTmp = neighbors(firstPosition, paths.concat(walls), height, width);
    // console.log(neighborsTmp)

    for (let position of neighborsTmp) {
      walls.push(position)
      mazeChanges.push({block: Block.AlgSaving, position: flatten(position, this.height, this.width)})
    }
    mazeChangeSave.push(mazeChanges)

    let newPosition = firstPosition;
    let oldPosition = firstPosition;

    // for (let i=0; i < 1000; i++) {
    //   if (walls.length === 0) { break };
    //   console.log(i);
    while (walls.length > 0) {
      newPosition = walls.splice(Math.floor(Math.random()*walls.length), 1)[0];
      let oldPositionLi = visitedNeighbors(newPosition, paths, height, width);
      oldPosition = oldPositionLi.splice(Math.floor(Math.random()*oldPositionLi.length), 1)[0];
  
      // mazeChanges.push({block: Block.Wall, position: flattenCorrect(newPosition, this.height, this.width)})
  
      walkToPosition(oldPosition, newPosition, mazeChangeSave, grid, height, width, paths)
  
      mazeChanges = [];
      for (let position of neighbors(newPosition, paths.concat(walls), height, width)) {
        walls.push(position)
        mazeChanges.push({block: Block.AlgSaving, position: flatten(position, this.height, this.width)})
      }
      mazeChangeSave.push(mazeChanges)
    }
    
    fillSides(grid, mazeChangeSave, height, width);
  }

  getRandomFirstPosition(height: number, width: number): Position {
    // Needs to be a even height and width
    let heightRange = Math.floor(height / 2);
    let widthRange  = Math.floor(width / 2);

    return { heightCoord: Math.floor(Math.random() * heightRange) * 2, widthCoord: Math.floor(Math.random() * widthRange) * 2}
  }
}





function walkToPosition(currPos: Position, nextPos: Position, mazeChanges: Array<Array<MazeChangeBlock>>, grid: Array<Array<Block>>, height: number, width: number, paths: Array<Position>) {
  if (currPos.heightCoord != nextPos.heightCoord) {
    if (currPos.heightCoord > nextPos.heightCoord) {
      for (let pos = currPos.heightCoord - 1; pos >= nextPos.heightCoord; pos--) {
        grid[pos][currPos.widthCoord] = Block.Path
        mazeChanges.push([{block: Block.Path, position: flatten({heightCoord: pos, widthCoord: currPos.widthCoord}, height, width)}])
        paths.push({heightCoord: pos, widthCoord: currPos.widthCoord})
      }
    } else {
      for (let pos = currPos.heightCoord + 1; pos <= nextPos.heightCoord; pos++) {
        grid[pos][currPos.widthCoord] = Block.Path
        mazeChanges.push([{block: Block.Path, position: flatten({heightCoord: pos, widthCoord: currPos.widthCoord}, height, width)}])
        paths.push({heightCoord: pos, widthCoord: currPos.widthCoord})
      }
    }
  } else if (currPos.widthCoord != nextPos.widthCoord) {
    if (currPos.widthCoord > nextPos.widthCoord) {
      for (let pos = currPos.widthCoord - 1; pos >= nextPos.widthCoord; pos--) {
        grid[currPos.heightCoord][pos] = Block.Path
        mazeChanges.push([{block: Block.Path, position: flatten({heightCoord: currPos.heightCoord, widthCoord: pos}, height, width)}])
        paths.push({heightCoord: currPos.heightCoord, widthCoord: pos})
      }
    } else {
      for (let pos = currPos.widthCoord + 1; pos <= nextPos.widthCoord; pos++) {
        grid[currPos.heightCoord][pos] = Block.Path
        mazeChanges.push([{block: Block.Path, position: flatten({heightCoord: currPos.heightCoord, widthCoord: pos}, height, width)}])
        paths.push({heightCoord: currPos.heightCoord, widthCoord: pos})
      }
    }
  }
}
