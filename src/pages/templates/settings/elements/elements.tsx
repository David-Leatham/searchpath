import { Inter } from '@next/font/google'
import settingsStripStyles from '../SettingsStrip.module.css'
import { StartNewSearch, clear, getClassNameSearch, getClassNameMaze } from './lib'

import { Board, SearchAlgorithm, SearchAlgorithmInfoList, SearchAlgorithmInfo, MazeAlgorithm, MazeAlgorithmInfoList, MazeAlgorithmInfo } from '@/lib/types'
import { useBoardStore } from "../../../store/boardStore";
import { useSearchAlgorithmsStore } from '../../../store/searchAlgorithmsStore'
import { useMazeAlgorithmsStore } from '../../../store/mazeAlgorithmsStore'

const inter = Inter({ subsets: ['latin'] });

interface TitleProps {
  title: string;
}

export function Title({title}: TitleProps) {
  return <a className={settingsStripStyles.settingsCatergoryTitle}>{ title }</a>
}


export function StartSearchButton() {
	const boardList: Board = useBoardStore<Board>((state)=>state.board);
  // const algRunning: boolean = useBoardStore<boolean>((state)=>state.algRunning);
  const searchAlgorithm: SearchAlgorithm = useSearchAlgorithmsStore<SearchAlgorithm>((state)=>state.searchAlgorithm);
  const searchAlgorithmInfoList: SearchAlgorithmInfoList = useSearchAlgorithmsStore<SearchAlgorithmInfoList>((state)=>state.searchAlgorithmInfoList);
  return (
    <a className={settingsStripStyles.button + ' ' + inter.className} onClick={StartNewSearch(boardList, searchAlgorithm, searchAlgorithmInfoList)}>Start</a>
  )
}

export function ClearSearchButten() {
	const boardList: Board = useBoardStore<Board>((state)=>state.board);
  return (
    <a className={settingsStripStyles.button + ' ' + inter.className} onClick={()=>{clear(boardList)}}>Clear</a>
  )
}


export function SearchAlgorithmsElements(): JSX.Element {
  const searchAlgorithm: SearchAlgorithm = useSearchAlgorithmsStore<SearchAlgorithm>((state)=>state.searchAlgorithm);
  const searchAlgorithmInfoList: SearchAlgorithmInfoList = useSearchAlgorithmsStore<SearchAlgorithmInfoList>((state)=>state.searchAlgorithmInfoList);
  const setSearchAlgorithm = useSearchAlgorithmsStore((state)=>{return (searchAlgo: SearchAlgorithm) => {state.setSearchAlorithm(searchAlgo)}});
  return (
    <div>
      { searchAlgorithmInfoList.map((searchAlgorithmInfo: SearchAlgorithmInfo, i) => {
        return <a key={i} className={getClassNameSearch(searchAlgorithm, searchAlgorithmInfo)} onClick={() => {setSearchAlgorithm(searchAlgorithmInfo.searchAlgorithm)}}>{ searchAlgorithmInfo.name }</a>
      })}
    </div>
  );
}

export function MazeElements(): JSX.Element {
  const mazeAlgorithm: MazeAlgorithm = useMazeAlgorithmsStore<MazeAlgorithm>((state)=>state.mazeAlgorithm);
  const mazeAlgorithmInfoList: MazeAlgorithmInfoList = useMazeAlgorithmsStore<MazeAlgorithmInfoList>((state)=>state.mazeAlgorithmInfoList);
  const setMazeAlgorithm = useMazeAlgorithmsStore((state)=>{return (mazeAlgo: MazeAlgorithm) => {state.setMazeAlorithm(mazeAlgo)}});
  return (
    <div>
      { mazeAlgorithmInfoList.map((mazeAlgorithmInfo: MazeAlgorithmInfo, i) => {
        return <a key={i} className={getClassNameMaze(mazeAlgorithm, mazeAlgorithmInfo)} onClick={() => {setMazeAlgorithm(mazeAlgorithmInfo.mazeAlgorithm)}}>{ mazeAlgorithmInfo.name }</a>
      })}
    </div>
  );
}