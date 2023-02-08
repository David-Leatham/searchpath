
import { Inter } from '@next/font/google'
import middleStyles from './Middle.module.css'
import settingsStripStyles from './SettingsStrip.module.css'
import { Block, Board, SearchPath } from '@/lib/types'
import { useBoardStore } from "../store/boardStore";
import { generatePath } from '@/lib/searchalgorithms/dijkstra';

const inter = Inter({ subsets: ['latin'] })
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function SettingsStrip() {
	const boardList: Board = useBoardStore<Board>((state)=>state.board);
	return (
		<div className={settingsStripStyles.startButtonOuter}>
			<button className={settingsStripStyles.startButtonInner + ' ' + inter.className} onClick={() => {startSeach(boardList)}}>Start</button>
		</div>
	)
}
  
async function startSeach(board: Board) {
	let startRGBColor = [221, 162, 6];
	let endRGBColor = [243, 211, 174];
	let searchpath: SearchPath = generatePath(board)
	for (let index=0; index < searchpath.searchList.length; index++) {
		let elem = document.getElementsByClassName(middleStyles.middle)[0].children.item(searchpath.searchList[index]) as HTMLElement
		if (board.boardList[searchpath.searchList[index]] == Block.Path) {
			let r = scale(startRGBColor[0], endRGBColor[0], index / searchpath.searchList.length);
			let g = scale(startRGBColor[1], endRGBColor[1], index / searchpath.searchList.length);
			let b = scale(startRGBColor[2], endRGBColor[2], index / searchpath.searchList.length);
			console.log('rgb(' + r + ',' + g + ',' + b + ')')
			elem.style.background = 'rgb(' + r + ',' + g + ',' + b + ')';
			elem.style.transform = 'rotate(90deg)';
			await sleep(50)
		}
	}
	for (let index of searchpath.shortestPath) {
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