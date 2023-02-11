import { SearchAlgorithmInfoList, SearchAlgorithm } from '@/lib/types';
import { generatePathFkt } from './helpers'

import dijkstraDepthFirst from './algorithms/dijkstraDepthFirst'
import dijkstraWidthFirst from './algorithms/dijkstraWidthFirst'



let searchAlgorithmInfoList: SearchAlgorithmInfoList = [
  { searchAlgorithm: SearchAlgorithm.DijkstraDepthFirst,
    name: 'Dijaks depth first',
    algorithm: generatePathFkt(dijkstraDepthFirst)},
  { searchAlgorithm: SearchAlgorithm.DijkstraWidthFirst,
    name: 'Dijaks width first',
    algorithm: generatePathFkt(dijkstraWidthFirst)}
]

export default searchAlgorithmInfoList