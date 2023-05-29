import { Block, MazeAlgAbstract, MazeChangeBlock, Position, isEqual } from '@/lib/types'
import { getInnerArray, innerArrayAddStartFinish, innerArrayToOut, flatten, neighbors, visitedNeighbors, fillSides } from '../helpers'

// From top to bottom, from left to right the grid

export default class AldousBorder extends MazeAlgAbstract {
  generateMaze(height: number, width: number) { return this.aldousBorderOut(height, width)[0] }

  getMazeBase(height: number, width: number) {
    let grid = getInnerArray(Block.Wall, height, width);
    if (!grid) {return []}

    this.setHeightWidth(height-2, width-2);
  
    innerArrayAddStartFinish(grid);
    return innerArrayToOut(height, width, grid)
  }
  
  getMazeChanges(height: number, width: number) { return this.aldousBorderOut(height, width)[1] }

  aldousBorderOut(height: number, width: number): [Array<Block>, Array<Array<MazeChangeBlock>>] {
    let grid = getInnerArray(Block.Wall, height, width);
    if (!grid) {return [[], []]}

    this.setHeightWidth(height-2, width-2);
  
    let mazeChangeSave: Array<Array<MazeChangeBlock>> = [];
    this.aldousBorder(grid, mazeChangeSave, height-2, width-2)

  
    innerArrayAddStartFinish(grid);


    let out = innerArrayToOut(height, width, grid)
    return [out, mazeChangeSave];
  }

  
  aldousBorder(grid: Array<Array<Block>>, mazeChangeSave: Array<Array<MazeChangeBlock>>, height: number, width: number) {
    if (!(height >= 2 && width >= 2 && height + width >= 5)) {
      return
    }
		
    let positions: Array<Position> = [];

    let firstPosition: Position = getRandomFirstPosition(height, width);
    
    grid[firstPosition.heightCoord][firstPosition.widthCoord] = Block.Path;
    positions.push(firstPosition);
    mazeChangeSave.push([{block: Block.AlgSaving, position: flatten(firstPosition, this.height, this.width)}])

		let neighborsTmp: Array<Position> = [];
		let currPos = firstPosition;
		let nextPos = firstPosition;

		let positionCount: Array<number> = [1, Math.ceil(height / 2) * Math.ceil(width / 2)]

		while (positionCount[0] != positionCount[1]) {
			currPos = nextPos;
			neighborsTmp = neighbors(currPos, [], height, width);
			nextPos = neighborsTmp.splice(Math.floor(Math.random()*neighborsTmp.length), 1)[0];

			walkToPosition(currPos, nextPos, mazeChangeSave, grid, height, width, positions, positionCount);
		}

		mazeChangeSave.push([{block: Block.Path, position: flatten(nextPos, this.height, this.width)}]);

		fillSides(grid, mazeChangeSave, height, width);
	}
}



function getRandomFirstPosition(height: number, width: number): Position {
	// Needs to be a even height and width
	let heightRange = Math.floor(height / 2);
	let widthRange  = Math.floor(width / 2);

	return { heightCoord: Math.floor(Math.random() * heightRange) * 2, widthCoord: Math.floor(Math.random() * widthRange) * 2}
}


function walkToPosition(currPos: Position, nextPos: Position, mazeChanges: Array<Array<MazeChangeBlock>>, grid: Array<Array<Block>>, height: number, width: number, positions: Array<Position>, positionCount: Array<number>) {
	let mazeChangesLi: Array<MazeChangeBlock> = [];

	mazeChangesLi.push({block: Block.Path, position: flatten(currPos, height, width)})
	mazeChangesLi.push({block: Block.AlgSaving, position: flatten(nextPos, height, width)})

	if (!elementInArray(nextPos, positions)) {
		positions.push(nextPos);
		positionCount[0] += 1;

		if (currPos.heightCoord != nextPos.heightCoord) {
			if (currPos.heightCoord > nextPos.heightCoord) {
				for (let pos = currPos.heightCoord - 1; pos >= nextPos.heightCoord; pos--) {
					grid[pos][currPos.widthCoord] = Block.Path
					if (pos != nextPos.heightCoord) {
						mazeChangesLi.push({block: Block.Path, position: flatten({heightCoord: pos, widthCoord: currPos.widthCoord}, height, width)})
					}
				}
			} else {
				for (let pos = currPos.heightCoord + 1; pos <= nextPos.heightCoord; pos++) {
					grid[pos][currPos.widthCoord] = Block.Path
					if (pos != nextPos.heightCoord) {
						mazeChangesLi.push({block: Block.Path, position: flatten({heightCoord: pos, widthCoord: currPos.widthCoord}, height, width)})
					}
				}
			}
		} else if (currPos.widthCoord != nextPos.widthCoord) {
			if (currPos.widthCoord > nextPos.widthCoord) {
				for (let pos = currPos.widthCoord - 1; pos >= nextPos.widthCoord; pos--) {
					grid[currPos.heightCoord][pos] = Block.Path
					if (pos != nextPos.widthCoord) {
						mazeChangesLi.push({block: Block.Path, position: flatten({heightCoord: currPos.heightCoord, widthCoord: pos}, height, width)})
					}
				}
			} else {
				for (let pos = currPos.widthCoord + 1; pos <= nextPos.widthCoord; pos++) {
					grid[currPos.heightCoord][pos] = Block.Path
					if (pos != nextPos.widthCoord) {
						mazeChangesLi.push({block: Block.Path, position: flatten({heightCoord: currPos.heightCoord, widthCoord: pos}, height, width)})
					}
				}
			}
		}
	}
	mazeChanges.push(mazeChangesLi)
}

function elementInArray(element: Position, array: Array<Position>): boolean {
	for (let arElem of array) {
		if (isEqual(arElem, element)) {
			return true
		}
	}
	return false
}