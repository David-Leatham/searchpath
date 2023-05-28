import { Block, MazeAlgAbstract } from '@/lib/types'
import { getInnerArray, innerArrayAddStartFinish, innerArrayToOut} from '../correctHelpers'


export default class Empty extends MazeAlgAbstract {
  generateMaze(height: number, width: number) { return empty(height, width) }
  getMazeBase(height: number, width: number) { return empty(height, width) }
  getMazeChanges(height: number, width: number) { return [] }
}

function empty(height: number, width: number): Array<Block> {
  let grid = getInnerArray(Block.Path, height, width);
  if (!grid) {return []}

  innerArrayAddStartFinish(grid);
  return innerArrayToOut(width, height, grid);
}