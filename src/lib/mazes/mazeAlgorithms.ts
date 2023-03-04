import { MazeAlgorithmInfoList, MazeAlgorithm } from '@/lib/types';

import kruskal from './algorithms/kruskal';
import empty from './algorithms/empty';
import recursiveDivision from './algorithms/recursiveDivision';
import recursiveBacktracking from './algorithms/recursiveBacktracking';



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
  },
  { mazeAlgorithm: MazeAlgorithm.RecursiveBacktracking,
    name: 'Recursive Backtracking',
    algorithm: recursiveBacktracking
  }
]

export default searchAlgorithmInfoList