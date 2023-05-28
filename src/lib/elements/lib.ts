import middleStyles from '@/pages/templates/Board.module.css'
import settingsStripStyles from '@/pages/templates/settings/SettingsStrip.module.css'

import { Inter } from '@next/font/google'

import { Block, Board, SearchAlgorithm, SearchAlgorithmInfoList, SearchAlgorithmInfo, SearchPath, MazeAlgorithm, MazeAlgorithmInfo, Style, StyleInfo, MazeAlgorithmInfoList, MazeAlgAbstract, MazeChangeBlock } from '@/lib/types'
import { getSearchAlgorithmRunning, getSearchAlgorithmStopRunning, setSearchAlgorithmRunning, setSearchAlgorithmStopRunning,
  getSlowMazeAlgorithmRunning, setSlowMazeAlgorithmRunning
} from '@/lib/store/globalVariables';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const inter = Inter({ subsets: ['latin'] })


let searchAlgPromise: Promise<void>;

export function StartNewSearch(boardList: Board, searchAlgorithm: SearchAlgorithm, searchAlgorithmInfoList: SearchAlgorithmInfoList, setBoardList: (board: Array<Block>) => void, slowMazeState: boolean, mazeAlgorithm: MazeAlgorithm, mazeAlgorithmInfoList: MazeAlgorithmInfoList) {
  return async function () {
    // First clear the board

    if (getSlowMazeAlgorithmRunning()) { return };
    
    setSearchAlgorithmStopRunning(true);
    if (getSearchAlgorithmRunning()) {
      clear(boardList, setBoardList, slowMazeState, mazeAlgorithm, mazeAlgorithmInfoList);
      await searchAlgPromise;
      await sleep(100);
    }
    // Then start a new search itteration
    searchAlgPromise = startSeach(boardList, searchAlgorithm, searchAlgorithmInfoList, setBoardList);
  }
}

export function clear(boardList: Board, setBoardList: (board: Array<Block>) => void, slowMazeState: boolean, mazeAlgorithm: MazeAlgorithm, mazeAlgorithmInfoList: MazeAlgorithmInfoList) {
  setSearchAlgorithmStopRunning(true);
  stopSlowMazeGeneration();

  if (slowMazeState) {
    setEmptyMaze(mazeAlgorithm, mazeAlgorithmInfoList, [boardList.height, boardList.width], setBoardList);
  } else {
    // let middleDiv = document.getElementsByClassName(middleStyles.middle)[0]
    for (let i=0; i < boardList.boardList.length; i++) {
      if (boardList.boardList[i] == Block.AlgSearched || boardList.boardList[i] == Block.AlgSolutionPath) {
        boardList.boardList[i] = Block.Path
        setBoardList(boardList.boardList)
        // let tmp = middleDiv.children.item(i) as HTMLElement
        // if (tmp) {
        //   tmp.style.background = ''
        //         tmp.style.transform = 'rotate(0deg)';
        // }
      }
    }
  }
}

async function startSeach(board: Board, searchAlgorithm: SearchAlgorithm, searchAlgorithmInfoList: SearchAlgorithmInfoList, setBoardList: (board: Array<Block>) => void) {
  if (getSlowMazeAlgorithmRunning()) { return }
  
  // Get the correct algorithm
  let searchAlgorithmInfo: null | SearchAlgorithmInfo = null;
  for (let algoInfo of searchAlgorithmInfoList) {
    if (algoInfo.searchAlgorithm == searchAlgorithm) {
      searchAlgorithmInfo = algoInfo
    }
  }
  if (!searchAlgorithmInfo) {return}

	let startRGBColor = [221, 162, 6];
	let endRGBColor = [243, 211, 174];
	let searchpath: SearchPath = searchAlgorithmInfo.algorithm(board)
  setSearchAlgorithmStopRunning(false);
  setSearchAlgorithmRunning(true);
  let stop = false;
	for (let index=0; index < searchpath.searchList.length; index++) {
    if (getSearchAlgorithmStopRunning()) {
      setSearchAlgorithmRunning(false);
      stop = true;
      break
    }
		// let elem = document.getElementsByClassName(middleStyles.middle)[0].children.item(searchpath.searchList[index]) as HTMLElement
		if (board.boardList[searchpath.searchList[index]] == Block.Path) {
		// 	let r = scale(startRGBColor[0], endRGBColor[0], index / searchpath.searchList.length);
		// 	let g = scale(startRGBColor[1], endRGBColor[1], index / searchpath.searchList.length);
		// 	let b = scale(startRGBColor[2], endRGBColor[2], index / searchpath.searchList.length);
    //   elem.style.transition = 'transform 300ms, background-color 300ms linear';
		// 	elem.style.background = 'rgb(' + r + ',' + g + ',' + b + ')';
		// 	elem.style.transform = 'rotate(90deg)';

    
      board.boardList[searchpath.searchList[index]] = Block.AlgSearched
      setBoardList(board.boardList)
			await sleep(50)
		}
	}
	for (let index of searchpath.shortestPath) {
    if (getSearchAlgorithmStopRunning() || stop) {
      setSearchAlgorithmRunning(false);
      break
    }
		// let elem = document.getElementsByClassName(middleStyles.middle)[0].children.item(index) as HTMLElement
		if (board.boardList[index] == Block.AlgSearched) {
			// elem.classList.add("blockShortestPath")
      // elem.style.transition = 'transform 300ms, background-color 300ms linear';
			// elem.style.background = '#D09683';
			// elem.style.transform = 'rotate(' + 0 + 'deg)';

      board.boardList[index] = Block.AlgSolutionPath
      setBoardList(board.boardList)
			await sleep(50)
		}
	}


	// rotationDeg += 90;
	// elem.style.transition = 'red 1000ms linear';
}



let algPromise: Promise<void>;
let tmp: AbortController | null = null;

export function stopSlowMazeGeneration() {
  if (tmp) {
    tmp.abort();
  }
}

export async function StartSlowMazeGeneration(mazeAlgorithm: MazeAlgorithm, mazeAlgorithmInfoList: MazeAlgorithmInfoList, boardSize: Array<number>, setBoardList: (board: Array<Block>) => void) {
  // Stop a possibly running generation
  stopSlowMazeGeneration();

  // Set up a new abortion controller. 
  // We now dont have access to old controllers, even if something went wrong.
  tmp = new AbortController();

  try {
    slowMazeGeneration(mazeAlgorithm, mazeAlgorithmInfoList, boardSize, setBoardList, {signal: tmp.signal});
  } catch (e: any) {
    // Throw only non abortion errors
    if (e.name !== 'AbortError') {
      throw e;
    }
  }
}

async function slowMazeGeneration(mazeAlgorithm: MazeAlgorithm, mazeAlgorithmInfoList: MazeAlgorithmInfoList, boardSize: Array<number>, setBoardList: (board: Array<Block>) => void, { signal }: { signal: AbortSignal }) {
  // Reference if we are aborting
  let abort = false;

  // Function is run on abortion (We just set abort to true).
  const onAbort = (e: any) => {
    abort = true;
  };

  // Now we also have to add an event listener to listen on aborts.
  signal.addEventListener('abort', onAbort, { once: true });
  
  // Get an empty maze
  let [mazeAlgorithmClass, boardList] = setEmptyMaze(mazeAlgorithm, mazeAlgorithmInfoList, boardSize, setBoardList);
  if (mazeAlgorithmClass === null || boardList === null) {
    return
  }

  setSlowMazeAlgorithmRunning(true);

  let boardMazeChanges = mazeAlgorithmClass.getMazeChanges(boardSize[1], boardSize[0]);
  if (boardMazeChanges !== null) {
    let toalTime = 13000 + 20 * boardMazeChanges.length; // 13 seconds + 0.02 seconds for every print
    let timePerPrint = toalTime / boardMazeChanges.length;

    for (let boardMazeChangeSection of boardMazeChanges) {
      if (abort) { break }

      for (let mazeChangeBlock of boardMazeChangeSection) {
        if (abort) { break }

        let blockToOverwrite = boardList[mazeChangeBlock.position];
        
        if (blockToOverwrite != Block.BoardBoundary && blockToOverwrite != Block.Start && blockToOverwrite != Block.Finish) {
          boardList[mazeChangeBlock.position] = mazeChangeBlock.block
        }
      }
      
      setBoardList(boardList);
      await sleep(timePerPrint);
    }
  } else {
    let boardElements = mazeAlgorithmClass.generateMaze(boardSize[1], boardSize[0]);
    
    for (let i=0; i < boardElements.length; i++) {
      if (abort) { break }

      if (boardElements[i] == Block.Wall) {
        boardList[i] = Block.Wall
        setBoardList(boardList);
        await sleep(50);
      }
    }
  }

  // Cleanup

  // Prevent memory leaks by removing listener
  signal.removeEventListener('abort', onAbort);
  // Change slow maze generation variable to "not running".
  setSlowMazeAlgorithmRunning(false);
}

function setEmptyMaze(mazeAlgorithm: MazeAlgorithm, mazeAlgorithmInfoList: MazeAlgorithmInfoList, boardSize: Array<number>, setBoardList: (board: Array<Block>) => void): [null | MazeAlgAbstract, null | Array<Block>] {
  let mazeAlgorithmClass: null | MazeAlgAbstract = null;
  for (let mazeAlgorithmInfo of mazeAlgorithmInfoList) {
    if (mazeAlgorithmInfo.mazeAlgorithm == mazeAlgorithm) {
      mazeAlgorithmClass = mazeAlgorithmInfo.algorithm;
    }
  }

  let emptyMaze: null | Array<Block> = null;
  if (mazeAlgorithmClass) {
    emptyMaze = mazeAlgorithmClass.getMazeBase(boardSize[1], boardSize[0]);

    if (emptyMaze === null) {
      let mazeAlgorithmClassEmpty: null | MazeAlgAbstract = null;
      for (let mazeAlgorithmInfo of mazeAlgorithmInfoList) {
        if (mazeAlgorithmInfo.mazeAlgorithm == MazeAlgorithm.Empty) {
          mazeAlgorithmClassEmpty = mazeAlgorithmInfo.algorithm;
        }
      }
      if (mazeAlgorithmClassEmpty) {
        emptyMaze = mazeAlgorithmClassEmpty.generateMaze(boardSize[1], boardSize[0])
      }
    }

    if (emptyMaze !== null) {
      setBoardList(emptyMaze);
    }
  }
  return [mazeAlgorithmClass, emptyMaze]
}

function scale(first: number, second: number, percent: number) {
	let lower: number;
	let higher: number;
	if (first < second) {
		lower = first;
		higher = second;
	} else {
		lower = second;
		higher = first;
	}
	return (higher - lower) * percent + lower 
}

export function getClassNameSearch(searchAlgorithm: SearchAlgorithm, searchAlgorithmInfo: SearchAlgorithmInfo): string {
  let out = settingsStripStyles.button + ' ' + inter.className 
  if (searchAlgorithm == searchAlgorithmInfo.searchAlgorithm) {
    out += ' ' + settingsStripStyles.buttonActive
  }
  return out
}

export function getClassNameMaze(mazeAlgorithm: MazeAlgorithm, mazeAlgorithmInfo: MazeAlgorithmInfo): string {
  let out = settingsStripStyles.button + ' ' + inter.className 
  if (mazeAlgorithm == mazeAlgorithmInfo.mazeAlgorithm) {
    out += ' ' + settingsStripStyles.buttonActive
  }
  return out
}

export function getClassNameStyle(style: Style, styleInfo: StyleInfo): string {
  let out = settingsStripStyles.button + ' ' + inter.className 
  if (style == styleInfo.style) {
    out += ' ' + settingsStripStyles.buttonActive
  }
  return out
}

