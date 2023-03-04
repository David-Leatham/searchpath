import { Block } from '@/lib/types'
import { getInnerPathArray, innerPathArrayAddStartFinish, innerPathArrayToOut} from '../helpers'

export default function empty(height: number, width: number): Array<Block> {
  let grid = getInnerPathArray(height, width);
  if (!grid) {return []}

  innerPathArrayAddStartFinish(grid);
  return innerPathArrayToOut(width, height, grid);
}