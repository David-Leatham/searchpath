import { Block, MazeAlgAbstract } from '@/lib/types'
import { getInnerPathArray, innerPathArrayAddStartFinish, innerPathArrayToOut} from '../helpers'


export default class Empty extends MazeAlgAbstract {
  generateMaze(height: number, width: number) { return empty(height, width) }
  getMazeBase(height: number, width: number) { return empty(height, width) }
  getMazeChanges(height: number, width: number) { return [] }
}

function empty(height: number, width: number): Array<Block> {
  let grid = getInnerPathArray(Block.Path, height, width);
  if (!grid) {return []}

  innerPathArrayAddStartFinish(grid);
  return innerPathArrayToOut(width, height, grid);
}