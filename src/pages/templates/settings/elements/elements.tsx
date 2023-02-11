import { Inter } from '@next/font/google'
import settingsStripStyles from '../SettingsStrip.module.css'
import { StartNewSearch, clear, getClassName } from './lib'

import { Board, SearchAlgorithm, SearchAlgorithmInfoList, SearchAlgorithmInfo } from '@/lib/types'
import { useBoardStore } from "../../../store/boardStore";
import { useSearchAlgorithmsStore } from '../../../store/searchAlgorithmsStore'

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
        return <a key={i} className={getClassName(searchAlgorithm, searchAlgorithmInfo)} onClick={() => {setSearchAlgorithm(searchAlgorithmInfo.searchAlgorithm)}}>{ searchAlgorithmInfo.name }</a>
      })}
    </div>
  );
}