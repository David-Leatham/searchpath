
import { Inter } from '@next/font/google'
import middleStyles from './Middle.module.css'
import settingsStripStyles from './SettingsStrip.module.css'
import { Block, Board, SearchPath, SearchAlgorithm, SearchAlgorithmInfoList, SearchAlgorithmInfo } from '@/lib/types'

import { useBoardStore } from "../store/boardStore";
import { useSearchAlgorithmsStore } from '../store/searchAlgorithmsStore'

import { getSearchAlgorithmRunning, getSearchAlgorithmStopRunning, setSearchAlgorithmRunning, setSearchAlgorithmStopRunning } from '@/pages/store/globalVariables';

// import searchAlorithmInfoList from '@/lib/searchalgorithms/searchAlgorithms'

const inter = Inter({ subsets: ['latin'] })
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function SettingsStrip() {
	return (
		<div className={settingsStripStyles.settingsOuter}>
			<div className={settingsStripStyles.settings}>
        <div>
          <StartSearchButton></StartSearchButton>
          <ClearSearchButten></ClearSearchButten>
        </div>
				<div>
					<a className={settingsStripStyles.settingsCatergoryTitle}>Shortest Path Algorithms</a>
          <SearchAlgorithmsElements></SearchAlgorithmsElements>
					{/* <a className={settingsStripStyles.button + ' ' + inter.className}>Dijaks depth first</a> */}
				</div>
			</div>
		</div>
	)
}

function StartSearchButton() {
	const boardList: Board = useBoardStore<Board>((state)=>state.board);
  // const algRunning: boolean = useBoardStore<boolean>((state)=>state.algRunning);
  const searchAlgorithm: SearchAlgorithm = useSearchAlgorithmsStore<SearchAlgorithm>((state)=>state.searchAlgorithm);
  const searchAlgorithmInfoList: SearchAlgorithmInfoList = useSearchAlgorithmsStore<SearchAlgorithmInfoList>((state)=>state.searchAlgorithmInfoList);
  return (
    <a className={settingsStripStyles.button + ' ' + inter.className} onClick={StartNewSearch(boardList, searchAlgorithm, searchAlgorithmInfoList)}>Start</a>
  )
}

function ClearSearchButten() {
	const boardList: Board = useBoardStore<Board>((state)=>state.board);
  return (
    <a className={settingsStripStyles.button + ' ' + inter.className} onClick={()=>{clear(boardList)}}>Clear</a>
  )
}

function StartNewSearch(boardList: Board, searchAlgorithm: SearchAlgorithm, searchAlgorithmInfoList: SearchAlgorithmInfoList) {
  return async function () {
    // First clear the board
    
    setSearchAlgorithmStopRunning(true);
    if (getSearchAlgorithmRunning()) {
      clear(boardList);
      await sleep(300);
    }
    // StopSearch()
    // Then start a new search itteration
    startSeach(boardList, searchAlgorithm, searchAlgorithmInfoList);
    // globalSearchAlgorithmStopRunning = true;
  }
}

function clear(boardList: Board) {
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

// return async function StopSearch() {
//   const setAlgRunning = useBoardStore((state)=>{return (bool: boolean) => {state.setAlgRunning(bool)}});
//   setAlgRunning(false);
//   await sleep(100);
//   // setAlgRunning(true);
//   startSeach(boardList, searchAlgorithm, searchAlgorithmInfoList);
// }
// }

function SearchAlgorithmsElements(): JSX.Element {
  const searchAlgorithm: SearchAlgorithm = useSearchAlgorithmsStore<SearchAlgorithm>((state)=>state.searchAlgorithm);
  const searchAlgorithmInfoList: SearchAlgorithmInfoList = useSearchAlgorithmsStore<SearchAlgorithmInfoList>((state)=>state.searchAlgorithmInfoList);
  const setSearchAlgorithm = useSearchAlgorithmsStore((state)=>{return (searchAlgo: SearchAlgorithm) => {state.setSearchAlorithm(searchAlgo)}});
  return (
    <div>
      { searchAlgorithmInfoList.map((searchAlgorithmInfo: SearchAlgorithmInfo, i) => {
        return <a key={i} className={getClassName(searchAlgorithm, searchAlgorithmInfo)} onClick={() => {setSearchAlgorithm(searchAlgorithmInfo.searchAlgorithm)}}>{ searchAlgorithmInfo.name }</a>
      })}
    </div>
  );
}

function getClassName(searchAlgorithm: SearchAlgorithm, searchAlgorithmInfo: SearchAlgorithmInfo): string {
  let out = settingsStripStyles.button + ' ' + inter.className 
  if (searchAlgorithm == searchAlgorithmInfo.searchAlgorithm) {
    out += ' ' + settingsStripStyles.buttonActive
  }
  return out
}

// var globalSearchAlgorithmStopRunning: boolean = false;
// var globalSearchAlgorithmRunning: boolean = false;

async function startSeach(board: Board, searchAlgorithm: SearchAlgorithm, searchAlgorithmInfoList: SearchAlgorithmInfoList) {
  // const setAlgRunning = useBoardStore((state)=>{return (bool: boolean) => {state.setAlgRunning(bool)}});
  // const algRunning: boolean = useBoardStore<boolean>((state)=>state.algRunning);
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
    // if (!algRunning) {
    //   setAlgRunning(false);
    //   // globalSearchAlgorithmStopRunning = false;
    //   break 
    // }
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

