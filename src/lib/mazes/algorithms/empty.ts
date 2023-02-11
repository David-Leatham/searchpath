import { Block } from '../../types'

export default function empty(height: number, width: number): Array<Block> {
  if (height == 0 || width == 0) {return []}
  
  let grid = new Array(height).fill(0).map(() => new Array(width).fill(Block.Path))
  // new Array(width));
  grid[0] = new Array(width).fill(Block.Wall)
  grid[height-1] = new Array(width).fill(Block.Wall)

  for (let row of grid) {
    row[0] = Block.Wall;
    row[row.length-1] = Block.Wall;
  }
  
  if ((width >= 3 && height >= 4) || (width >= 4 && height >= 3)) {
    grid[1][1] = Block.Start
    grid[grid.length-2][grid[0].length-2] = Block.Finish
  }
  
  let out: Array<number> = grid.flat(1);
  return out
}