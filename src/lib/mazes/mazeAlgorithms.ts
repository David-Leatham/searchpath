import { MazeAlgorithmInfoList, MazeAlgorithm } from '@/lib/types';
// import { generatePathFkt } from './helpers'

import kruskal from './algorithms/kruskal'
import empty from './algorithms/empty'



let searchAlgorithmInfoList: MazeAlgorithmInfoList = [
  { mazeAlgorithm: MazeAlgorithm.Kruskal,
    name: 'Kruskal',
    algorithm: kruskal},
  { mazeAlgorithm: MazeAlgorithm.Empty,
    name: 'Empty',
    algorithm: empty}
]

export default searchAlgorithmInfoList