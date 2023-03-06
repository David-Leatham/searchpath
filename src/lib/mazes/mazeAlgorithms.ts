import { MazeAlgorithmInfoList, MazeAlgorithm, MazeAlgAbstract } from '@/lib/types';

import kruskal from './algorithms/kruskal';
import Empty from './algorithms/empty';
import RecursiveDivision from './algorithms/recursiveDivision';
import RecursiveBacktracking from './algorithms/recursiveBacktracking';



let searchAlgorithmInfoList: MazeAlgorithmInfoList = [
  // { mazeAlgorithm: MazeAlgorithm.Kruskal,
  //   name: 'Kruskal',
  //   algorithm: kruskal},
  { mazeAlgorithm: MazeAlgorithm.RecursiveDivision,
    name: 'Recursive Division',
    algorithm: new RecursiveDivision
  },
  { mazeAlgorithm: MazeAlgorithm.RecursiveBacktracking,
    name: 'Recursive Backtracking',
    algorithm: new RecursiveBacktracking
  },
  { mazeAlgorithm: MazeAlgorithm.Empty,
    name: 'Empty',
    algorithm: new Empty
  },
]

export default searchAlgorithmInfoList