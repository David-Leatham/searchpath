import { Block } from '../../types'

function randrange(min: number, max: number, range: number) {
  return Math.floor(Math.random() * (max - min) / range) * range + min;
}

export default function generateKruskal(height: number, width: number): Array<Block> {
  if (height == 0 || width == 0) {return []}

  let VERTICAL = 0
  let HORIZONTAL = 1
  
  let grid = new Array(height).fill(0).map(() => new Array(width).fill(Block.Path))
  // new Array(width));
  grid[0] = new Array(width).fill(Block.Wall)
  grid[height-1] = new Array(width).fill(Block.Wall)

  for (let row of grid) {
    row[0] = Block.Wall;
    row[row.length-1] = Block.Wall;
  }

  let region_stack = [[[1, 1], [height - 2, width - 2]]]

  while (region_stack.length > 0) {
    let current_region = region_stack.pop()
    if (current_region) {
      let min_y = current_region[0][0]
      let max_y = current_region[1][0]
      let min_x = current_region[0][1]
      let max_x = current_region[1][1]
      let heightInner = max_y - min_y + 1
      let widthInner = max_x - min_x + 1
  
      if (heightInner <= 1 || widthInner <= 1) {
        continue
      }

      let cut_direction: number;
      if (widthInner < heightInner) {
        cut_direction = HORIZONTAL  // with 100% chance
      } else if (widthInner > heightInner) {
        cut_direction = VERTICAL  // with 100% chance
      } else {
        if (widthInner == 2) {
          continue
        }
        cut_direction = Math.round(Math.random())
      }
  
      // MAKE CUT
      // select cut position (can't be completely on the edge of the region)
      let cut_length = [heightInner, widthInner][(cut_direction + 1) % 2]
      if (cut_length < 3) {
        continue
      }

      // let cut_posi = randrange(1, cut_length, 2)
      let cut_posi = randrange(1, cut_length - (1 - cut_length % 2), 2) // This cind of fixes the last row beeing taken up
      // select new door position
      let door_posi = randrange(0, [heightInner, widthInner][cut_direction], 2)
      // add walls to correct places
      if (cut_direction === 0) {  // vertical
        for (let row=min_y; row <= max_y; row++) {
          grid[row][min_x + cut_posi] = Block.Wall
        }
        grid[min_y + door_posi][min_x + cut_posi] = Block.Path
      } else {  // horizontal
        for (let col=min_x; col <= max_x; col++) {
          grid[min_y + cut_posi][col] = Block.Wall
        }
        grid[min_y + cut_posi][min_x + door_posi] = Block.Path
      }

      // break;


      // add new regions to stack
      if (cut_direction == 0) { // # vertical
        region_stack.push([[min_y, min_x], [max_y, min_x + cut_posi - 1]])
        region_stack.push([[min_y, min_x + cut_posi + 1], [max_y, max_x]])
      } else {  // horizontal
        region_stack.push([[min_y, min_x], [min_y + cut_posi - 1, max_x]])
        region_stack.push([[min_y + cut_posi + 1, min_x], [max_y, max_x]])
      }

    }
  }
  if ((width >= 3 && height >= 4) || (width >= 4 && height >= 3)) {
    grid[1][1] = Block.Start
    grid[grid.length-2][grid[0].length-2] = Block.Finish
  }
  
  let out: Array<number> = grid.flat(1);
  return out
}