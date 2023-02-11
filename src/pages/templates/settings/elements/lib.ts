import middleStyles from '../../Middle.module.css'
import settingsStripStyles from '../SettingsStrip.module.css'

import { Inter } from '@next/font/google'

import { Block, Board, SearchAlgorithm, SearchAlgorithmInfoList, SearchAlgorithmInfo, SearchPath, MazeAlgorithm, MazeAlgorithmInfo } from '@/lib/types'
import { getSearchAlgorithmRunning, getSearchAlgorithmStopRunning, setSearchAlgorithmRunning, setSearchAlgorithmStopRunning } from '@/pages/store/globalVariables';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const inter = Inter({ subsets: ['latin'] })


export function StartNewSearch(boardList: Board, searchAlgorithm: SearchAlgorithm, searchAlgorithmInfoList: SearchAlgorithmInfoList) {
  return async function () {
    // First clear the board
    
    setSearchAlgorithmStopRunning(true);
    if (getSearchAlgorithmRunning()) {
      clear(boardList);
      await sleep(300);
    }
    // Then start a new search itteration
    startSeach(boardList, searchAlgorithm, searchAlgorithmInfoList);
  }
}

export function clear(boardList: Board) {
  setSearchAlgorithmStopRunning(true);
  let middleDiv = document.getElementsByClassName(middleStyles.middle)[0]
  for (let i=0; i < boardList.boardList.length; i++) {
    if (boardList.boardList[i] == Block.Path) {
      let tmp = middleDiv.children.item(i) as HTMLElement
      if (tmp) {
        tmp.style.background = ''
              tmp.style.transform = 'rotate(0deg)';
      }
    }
  }
}

async function startSeach(board: Board, searchAlgorithm: SearchAlgorithm, searchAlgorithmInfoList: SearchAlgorithmInfoList) {
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
		let elem = document.getElementsByClassName(middleStyles.middle)[0].children.item(searchpath.searchList[index]) as HTMLElement
		if (board.boardList[searchpath.searchList[index]] == Block.Path) {
			let r = scale(startRGBColor[0], endRGBColor[0], index / searchpath.searchList.length);
			let g = scale(startRGBColor[1], endRGBColor[1], index / searchpath.searchList.length);
			let b = scale(startRGBColor[2], endRGBColor[2], index / searchpath.searchList.length);
			elem.style.background = 'rgb(' + r + ',' + g + ',' + b + ')';
			elem.style.transform = 'rotate(90deg)';
			await sleep(50)
		}
	}
	for (let index of searchpath.shortestPath) {
    if (getSearchAlgorithmStopRunning() || stop) {
      setSearchAlgorithmRunning(false);
      break
    }
		let elem = document.getElementsByClassName(middleStyles.middle)[0].children.item(index) as HTMLElement
		if (board.boardList[index] == Block.Path) {
			// elem.classList.add("blockShortestPath")
			elem.style.background = '#D09683';
			elem.style.transform = 'rotate(' + 0 + 'deg)';
			await sleep(50)
		}
	}
	// rotationDeg += 90;
	// elem.style.transition = 'red 1000ms linear';
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