import { Inter } from '@next/font/google';
import settingsStripStyles from '@/pages/templates/settings/SettingsStrip.module.css';
import { StartNewSearch, clear, getClassNameSearch, getClassNameMaze, getClassNameStyle } from './lib';

import { Board, SearchAlgorithm, SearchAlgorithmInfoList, SearchAlgorithmInfo, MazeAlgorithm, MazeAlgorithmInfoList, MazeAlgorithmInfo, StyleInfoList, StyleInfo, Style } from '@/lib/types';
import { useBoardStore } from "@/lib/store/boardStore";
import { useSearchAlgorithmsStore } from '@/lib/store/searchAlgorithmsStore';
import { useMazeAlgorithmsStore } from '@/lib/store/mazeAlgorithmsStore';
import { useStyleStore } from '@/lib/store/styleStore';
import { useSlowMazeStateStore } from '@/lib/store/slowMazeStateStore';

import classNames from 'classnames';

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

export function SlowMazeGenerationToggleButton() {
	const slowMazeState: boolean = useSlowMazeStateStore<boolean>((state)=>state.slowMazeState);
  const toggleSlowMazeState = useSlowMazeStateStore((state)=>{return () => {state.toggleSlowMazeState()}});
  return (
    <a className={classNames(settingsStripStyles.button + ' ' + inter.className, {[settingsStripStyles.buttonActive]: slowMazeState})} onClick={toggleSlowMazeState}>Toggle slow Maze Generation</a>
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

export function StyleElements(): JSX.Element {
  const style: Style = useStyleStore<Style>((state)=>state.style);
  const styleInfoList: StyleInfoList = useStyleStore<StyleInfoList>((state)=>state.styleInfoList);
  const setStyle = useStyleStore((state)=>{return (style: Style) => {state.setStyle(style)}});
  return (
    <div>
      { styleInfoList.map((styleInfo: StyleInfo, i) => {
        return <a key={i} className={getClassNameStyle(style, styleInfo)} onClick={() => {setStyle(styleInfo.style)}}>{ styleInfo.name }</a>
      })}
    </div>
  );
}