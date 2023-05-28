import { MazeAlgorithmInfoList, MazeAlgorithm, MazeAlgAbstract } from '@/lib/types';

import kruskal from './algorithms/kruskal';
import Empty from './algorithms/empty';
import RecursiveDivision from './algorithms/recursiveDivision';
import RecursiveBacktracking from './algorithms/recursiveBacktracking';
import RandomizedPrim from './algorithms/randomizedPrim';



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
  { mazeAlgorithm: MazeAlgorithm.RandomizedPrim,
    name: 'Prim Randomized',
    algorithm: new RandomizedPrim
  },
  { mazeAlgorithm: MazeAlgorithm.Empty,
    name: 'Drawable',
    algorithm: new Empty
  },
]

export default searchAlgorithmInfoList