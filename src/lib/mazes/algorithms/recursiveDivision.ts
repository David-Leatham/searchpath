import { Block } from '@/lib/types'
import { getInnerPathArray, innerPathArrayAddStartFinish, innerPathArrayToOut, getRandomInt} from '../helpers'

export default function empty(height: number, width: number): Array<Block> {
  let grid = getInnerPathArray(height, width);
  if (!grid) {return []}

  recursive_divide(grid, 0, height-2, 0, width-2)

  innerPathArrayAddStartFinish(grid);
  return innerPathArrayToOut(width, height, grid);
}


function recursive_divide(grid: Array<Array<Block>>, heightLowerBound: number, heightUpperBound: number, widthLowerBound: number, widthUpperBound: number) {
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
    for (let i=widthLowerBound; i<widthUpperBound; i++) {
      if (i != borderHole) {
        grid[borderHeight][i] = Block.Wall;
      }
    }
    recursive_divide(grid, heightLowerBound, borderHeight, widthLowerBound, widthUpperBound);
    recursive_divide(grid, borderHeight+1, heightUpperBound, widthLowerBound, widthUpperBound);
  } else {
    let borderWidth = getRandomInt(widthLowerBound+1, widthUpperBound-1, false, true)
    let borderHole = getRandomInt(heightLowerBound, heightUpperBound, true, false)
    for (let i=heightLowerBound; i<heightUpperBound; i++) {
      if (i != borderHole) {
        grid[i][borderWidth] = Block.Wall;
      }
    }
    recursive_divide(grid, heightLowerBound, heightUpperBound, widthLowerBound, borderWidth);
    recursive_divide(grid, heightLowerBound, heightUpperBound, borderWidth+1, widthUpperBound);
  }
}
