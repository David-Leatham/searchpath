import { MazeAlgorithmInfoList, MazeAlgorithm } from '@/lib/types';
// import { generatePathFkt } from './helpers'

import kruskal from './algorithms/kruskal'
import empty from './algorithms/empty'
import recursiveDivision from './algorithms/recursiveDivision'



let searchAlgorithmInfoList: MazeAlgorithmInfoList = [
  { mazeAlgorithm: MazeAlgorithm.Kruskal,
    name: 'Kruskal',
    algorithm: kruskal},
  { mazeAlgorithm: MazeAlgorithm.Empty,
    name: 'Empty',
    algorithm: empty},
  { mazeAlgorithm: MazeAlgorithm.RecursiveDivision,
    name: 'Recursive Division',
    algorithm: recursiveDivision
  }
]

export default searchAlgorithmInfoList