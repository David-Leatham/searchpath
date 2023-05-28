import { Block, MazeAlgAbstract, MazeChangeBlock, Position } from '@/lib/types'
import { getInnerArrayCorrect, innerArrayAddStartFinish, innerArrayToOutCorrect, getRandomInt, flatten, flattenCorrect, neighbors, visitedNeighbors } from '../correctHelpers'

// From top to bottom, from left to right the grid

export default class RandomizedPrim extends MazeAlgAbstract {
  generateMaze(height: number, width: number) { return this.randomizedPrimOut(height, width)[0] }

  getMazeBase(height: number, width: number) {
    let grid = getInnerArrayCorrect(Block.Wall, height, width);
    if (!grid) {return []}

    this.setHeightWidth(height-2, width-2);
  
    innerArrayAddStartFinish(grid);
    return innerArrayToOutCorrect(height, width, grid)
  }
  
  getMazeChanges(height: number, width: number) { return this.randomizedPrimOut(height, width)[1] }

  randomizedPrimOut(height: number, width: number): [Array<Block>, Array<Array<MazeChangeBlock>>] {
    let grid = getInnerArrayCorrect(Block.Wall, height, width);
    if (!grid) {return [[], []]}

    this.setHeightWidth(height-2, width-2);
  
    let mazeChangeSave: Array<Array<MazeChangeBlock>> = [];
    this.randomizedPrim(grid, mazeChangeSave, height-2, width-2)

  
    innerArrayAddStartFinish(grid);


    let out = innerArrayToOutCorrect(height, width, grid)
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

    mazeChangeSave.push([{block: Block.Path, position: flattenCorrect(firstPosition, this.height, this.width)}])
    
    let mazeChanges: Array<MazeChangeBlock> = [];
    let neighborsTmp = neighbors(firstPosition, paths.concat(walls), height, width);
    // console.log(neighborsTmp)

    for (let position of neighborsTmp) {
      walls.push(position)
      mazeChanges.push({block: Block.AlgSaving, position: flattenCorrect(position, this.height, this.width)})
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
        mazeChanges.push({block: Block.AlgSaving, position: flattenCorrect(position, this.height, this.width)})
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



function fillSides(grid: Array<Array<Block>>, mazeChangeSave: Array<Array<MazeChangeBlock>>, height: number, width: number): void {
  let mazeChanges: Array<MazeChangeBlock> = [];

  if (width % 2 == 0) {
    let fillPosition = 0
    while (fillPosition < height) {
      grid[fillPosition][width-1] = Block.Path
      mazeChanges.push({block: Block.Path, position: flattenCorrect({heightCoord: fillPosition, widthCoord: width-1}, height, width)});
      fillPosition += 2
    }
  }
  if (height % 2 == 0) {
    let fillPosition = 0
    while (fillPosition < width) {
      grid[height-1][fillPosition] = Block.Path
      mazeChanges.push({block: Block.Path, position: flattenCorrect({heightCoord: height-1, widthCoord: fillPosition}, height, width)});
      fillPosition += 2
    }
  }
  mazeChangeSave.push(mazeChanges);
}

function walkToPosition(currPos: Position, nextPos: Position, mazeChanges: Array<Array<MazeChangeBlock>>, grid: Array<Array<Block>>, height: number, width: number, paths: Array<Position>) {
  if (currPos.heightCoord != nextPos.heightCoord) {
    if (currPos.heightCoord > nextPos.heightCoord) {
      for (let pos = currPos.heightCoord - 1; pos >= nextPos.heightCoord; pos--) {
        grid[pos][currPos.widthCoord] = Block.Path
        mazeChanges.push([{block: Block.Path, position: flattenCorrect({heightCoord: pos, widthCoord: currPos.widthCoord}, height, width)}])
        paths.push({heightCoord: pos, widthCoord: currPos.widthCoord})
      }
    } else {
      for (let pos = currPos.heightCoord + 1; pos <= nextPos.heightCoord; pos++) {
        grid[pos][currPos.widthCoord] = Block.Path
        mazeChanges.push([{block: Block.Path, position: flattenCorrect({heightCoord: pos, widthCoord: currPos.widthCoord}, height, width)}])
        paths.push({heightCoord: pos, widthCoord: currPos.widthCoord})
      }
    }
  } else if (currPos.widthCoord != nextPos.widthCoord) {
    if (currPos.widthCoord > nextPos.widthCoord) {
      for (let pos = currPos.widthCoord - 1; pos >= nextPos.widthCoord; pos--) {
        grid[currPos.heightCoord][pos] = Block.Path
        mazeChanges.push([{block: Block.Path, position: flattenCorrect({heightCoord: currPos.heightCoord, widthCoord: pos}, height, width)}])
        paths.push({heightCoord: currPos.heightCoord, widthCoord: pos})
      }
    } else {
      for (let pos = currPos.widthCoord + 1; pos <= nextPos.widthCoord; pos++) {
        grid[currPos.heightCoord][pos] = Block.Path
        mazeChanges.push([{block: Block.Path, position: flattenCorrect({heightCoord: currPos.heightCoord, widthCoord: pos}, height, width)}])
        paths.push({heightCoord: currPos.heightCoord, widthCoord: pos})
      }
    }
  }
}
