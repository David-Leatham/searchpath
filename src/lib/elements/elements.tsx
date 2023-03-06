import { Inter } from '@next/font/google';
import settingsStripStyles from '@/pages/templates/settings/SettingsStrip.module.css';
import { StartNewSearch, clear, getClassNameSearch, getClassNameMaze, getClassNameStyle, StartSlowMazeGeneration } from './lib';

import { Board, SearchAlgorithm, SearchAlgorithmInfoList, SearchAlgorithmInfo, MazeAlgorithm, MazeAlgorithmInfoList, MazeAlgorithmInfo, StyleInfoList, StyleInfo, Style, BoardSize, Block } from '@/lib/types';
import { useBoardSizeStore, useBoardListStore } from "@/lib/store/boardStore";
import { useSearchAlgorithmsStore } from '@/lib/store/searchAlgorithmsStore';
import { useMazeAlgorithmsStore } from '@/lib/store/mazeAlgorithmsStore';
import { useStyleStore } from '@/lib/store/styleStore';
import { useSlowMazeStateStore } from '@/lib/store/slowMazeStateStore';
import { useGenerateMazeStateStore } from '@/lib/store/generateMazeStateStore';

import classNames from 'classnames';

const inter = Inter({ subsets: ['latin'] });

interface TitleProps {
  title: string;
}

export function Title({title}: TitleProps) {
  return <a className={settingsStripStyles.settingsCatergoryTitle}>{ title }</a>
}


export function StartSearchButton() {
  const boardSize = useBoardSizeStore<BoardSize>((state)=>state.boardSize)
  const boardList = useBoardListStore<Array<Block>>((state)=>state.boardList)
	const board: Board = {height: boardSize.height, width: boardSize.width, boardList: boardList}
  // const algRunning: boolean = useBoardStore<boolean>((state)=>state.algRunning);
  const searchAlgorithm: SearchAlgorithm = useSearchAlgorithmsStore<SearchAlgorithm>((state)=>state.searchAlgorithm);
  const searchAlgorithmInfoList: SearchAlgorithmInfoList = useSearchAlgorithmsStore<SearchAlgorithmInfoList>((state)=>state.searchAlgorithmInfoList);
  return (
    <a className={settingsStripStyles.button + ' ' + inter.className} onClick={StartNewSearch(board, searchAlgorithm, searchAlgorithmInfoList)}>Start</a>
  )
}

export function ClearSearchButton() {
  const boardSize = useBoardSizeStore<BoardSize>((state)=>state.boardSize)
  const boardList = useBoardListStore<Array<Block>>((state)=>state.boardList)
	const board: Board = {height: boardSize.height, width: boardSize.width, boardList: boardList}
	// const board: Board = useBoardStore<Board>((state)=>state.board);
  return (
    <a className={settingsStripStyles.button + ' ' + inter.className} onClick={()=>{clear(board)}}>Clear</a>
  )
}

export function GenerateMazeButton() {
  const toggleGenerateMazeState = useGenerateMazeStateStore((state)=>{return state.toggleGenerateMazeState });  
  return (
    <a className={settingsStripStyles.button + ' ' + inter.className} onClick={toggleGenerateMazeState}>Generate Maze</a>
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