import { Block, Position, isEqual } from '../types'

// From top to bottom, from left to right the grid

export function getInnerArray(block: Block, height: number, width: number): null | Array<Array<Block>> {
	let grid: null | Array<Array<Block>> = null
	if ((width >= 3 && height >= 4) || (width >= 4 && height >= 3)) {
		grid = new Array(width-2).fill(0).map(() => new Array(height-2).fill(block))
	}
	return grid
}

export function getInnerArrayCorrect(block: Block, height: number, width: number): null | Array<Array<Block>> {
	let grid: null | Array<Array<Block>> = null
	if ((width >= 3 && height >= 4) || (width >= 4 && height >= 3)) {
		grid = new Array(height-2).fill(0).map(() => new Array(width-2).fill(block))
	}
	return grid
}

export function innerArrayAddStartFinish(grid: Array<Array<Block>>): Array<Array<Block>> {
	grid[0][0] = Block.Start
	grid[grid.length-1][grid[0].length-1] = Block.Finish
	return grid
}

export function innerArrayToOut(height: number, width: number, grid: Array<Array<Block>>): Array<Block> {
	for (let i=0; i<grid.length; i++) {
		grid[i].unshift(Block.BoardBoundary)
		grid[i].push(Block.BoardBoundary)
	}
	grid.unshift(new Array(height).fill(Block.BoardBoundary))
	grid.push(new Array(height).fill(Block.BoardBoundary))

	let out: Array<number> = grid.flat(1);
	return out
}

export function innerArrayToOutCorrect(height: number, width: number, grid: Array<Array<Block>>): Array<Block> {
	for (let i=0; i<grid.length; i++) {
		grid[i].unshift(Block.BoardBoundary)
		grid[i].push(Block.BoardBoundary)
	}
	grid.unshift(new Array(width).fill(Block.BoardBoundary))
	grid.push(new Array(width).fill(Block.BoardBoundary))

	let gridOut = grid[0].map((_, colIndex) => grid.map(row => row[colIndex]))
	let out: Array<number> = gridOut.flat(1);
	return out
}



export function getRandomInt(min: number, max: number, even: boolean = false, odd: boolean = false) {
	// The maximum not and the minimum included
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

export function flatten(position: Position, height: number, width: number): number {
  return (width + 2) * (position.widthCoord + 1) +   (position.heightCoord + 1)
}

export function flattenCorrect(position: Position, height: number, width: number): number {
	return (height + 2) * (position.widthCoord + 1) +   (position.heightCoord + 1)
  }



export function neighbors(position: Position, visited: Array<Position>, height: number, width: number): Array<Position> {
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
  
	let i=0;
	while (i < neighborsLi.length) {
	  for (let visitedPos of visited) {
		if (isEqual(visitedPos, neighborsLi[i])) {
		  neighborsLi.splice(i, 1)
		  i -= 1
		  break
		}
	  }
	  i += 1
	}
	return neighborsLi
}

export function visitedNeighbors(position: Position, visited: Array<Position>, height: number, width: number): Array<Position> {
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

  let outNeighborsLi: Array<Position> = []
	let i=0;
	while (i < neighborsLi.length) {
	  for (let visitedPos of visited) {
			if (isEqual(visitedPos, neighborsLi[i])) {
				outNeighborsLi.push(visitedPos)
			}
	  }
	  i += 1
	}
	return outNeighborsLi
}