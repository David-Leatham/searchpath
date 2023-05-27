import React, { useState, useEffect, useRef, useCallback } from "react";

import styles from './Board.module.css';
import  { newBoardGenAndgetBoardDivList, getBoxCount } from '@/lib/elements/boardLib'

import { setSearchAlgorithmStopRunning } from '@/lib/store/globalVariables';
import { useBoardListStore, useBoardSizeStore } from "@/lib/store/boardStore";
import { useMazeAlgorithmsStore } from '@/lib/store/mazeAlgorithmsStore';
import { useStyleStore } from '@/lib/store/styleStore';
import { useGenerateMazeStateStore } from '@/lib/store/generateMazeStateStore';
import { useSlowMazeStateStore } from '@/lib/store/slowMazeStateStore';
import { Block, MazeAlgorithm, MazeAlgorithmInfoList, Style, StyleInfoList, MazeAlgAbstract, Board as BoardType } from '@/lib/types';
import classNames from 'classnames';
import { conditionalStyleDict } from '@/lib/hepers';

import { StartSlowMazeGeneration, clear, stopSlowMazeGeneration } from '@/lib/elements/lib'

import ResizeObserver from 'resize-observer-polyfill';



export default function Board() {

  //////////////////////// Init all the store elements

  const setBoardSize = useBoardSizeStore((state)=>{return (size: Array<number>) => {state.setHeight(size[0]); state.setWidth(size[1])}});
  const setBoardList = useBoardListStore((state)=>{return (board: Array<Block>) => {state.setBoardList(board)}});
  const boardSize: Array<number> = useBoardSizeStore<Array<number>>((state)=>[state.boardSize.height, state.boardSize.width]);
  const boardList: Array<Block> = useBoardListStore<Array<number>>((state)=>state.boardList);

  const style: Style = useStyleStore<Style>((state)=>state.style);
  const styleInfoList: StyleInfoList = useStyleStore<StyleInfoList>((state)=>state.styleInfoList);

  const mazeAlgorithm: MazeAlgorithm = useMazeAlgorithmsStore<MazeAlgorithm>((state)=>state.mazeAlgorithm);
  const mazeAlgorithmInfoList: MazeAlgorithmInfoList = useMazeAlgorithmsStore<MazeAlgorithmInfoList>((state)=>state.mazeAlgorithmInfoList);

  const generateMazeState: boolean = useGenerateMazeStateStore<boolean>((state)=>state.generateMazeState);
	const slowMazeState: boolean = useSlowMazeStateStore<boolean>((state)=>state.slowMazeState);

  const toggleGenerateMazeState = useGenerateMazeStateStore((state)=>{return state.toggleGenerateMazeState });


  //////////////////////// Init references

  // For the Board Size callback
  let lastBoardSize = useRef<Array<number>>([0, 0]);

  // Automatic reference to middle HTML element
  const middleRef = useRef<HTMLDivElement | null>(null);

  // Needed for board size callback. But does the callback really need it?
  const slowMazeStateRef = useRef<boolean>(slowMazeState);

  // Needed for board size callback. But does the callback really need it?
  const mazeAlgorithmStateRef = useRef<MazeAlgorithm | null>(mazeAlgorithm);


  //////////////////////// Keep a resizeBoardElement Ref updated for the Board Size callback

  const [resizeBoardElement, setResizeBoardElement] = useState<null | HTMLElement>(null);
  const resizeBoardElementRef = useRef<null | HTMLElement>(null);

  useEffect(() => {
    resizeBoardElementRef.current = resizeBoardElement;
  }, [resizeBoardElement])


  //////////////////////// Rerender the board with a new maze

  const rerenderBoard = (boardSize: Array<number>, slowMazeStateRef: React.MutableRefObject<boolean>) => {
    // We are working purely with references in this function, 
    // because it needs to get called by the board resize callback.
      
    let mazeAlgClass: null | MazeAlgAbstract = null;
    for (let mazeAlgorithmInfo of mazeAlgorithmInfoList) {
      if (mazeAlgorithmInfo.mazeAlgorithm == mazeAlgorithmStateRef.current) {
        mazeAlgClass = mazeAlgorithmInfo.algorithm;
      }
    }
    if (mazeAlgClass) {
      setBoardSize(boardSize);
      if (resizeBoardElementRef.current) {
        // This is only updated when the board size actually changes.
        resizeBoardElementRef.current.style.gridTemplateRows = 'repeat(' + boardSize[1] + ', 2fr)';
      }

      let boardElements: Array<Block> | null = null;

      if (slowMazeStateRef.current) {
        boardElements = mazeAlgClass.getMazeBase(boardSize[0], boardSize[1])
      }

      if (boardElements === null) {
        boardElements = mazeAlgClass.generateMaze(boardSize[0], boardSize[1])
      }

      setBoardList(boardElements);
    }
  }


  //////////////////////// Handle new maze generation state change

  useEffect(() => {
    // Update reference for callback
    slowMazeStateRef.current = slowMazeState

    if (slowMazeState) {
      // We want to generate a new maze when entering slow maze generation
      toggleGenerateMazeState()
    } else {
      stopSlowMazeGeneration()
      rerenderBoard(lastBoardSize.current, slowMazeStateRef);
    }
  }, [slowMazeState])


  //////////////////////// Handle new maze generation state change

  useEffect(() => {
    if (slowMazeState) {
      setSearchAlgorithmStopRunning(true);
      StartSlowMazeGeneration(mazeAlgorithm, mazeAlgorithmInfoList, boardSize, setBoardList);
    } else {
      const boardTmp: BoardType = {height: boardSize[0], width: boardSize[1], boardList: boardList}
      clear(boardTmp, setBoardList, slowMazeState, mazeAlgorithm, mazeAlgorithmInfoList)
      rerenderBoard(lastBoardSize.current, slowMazeStateRef);
    }
  }, [generateMazeState])


  //////////////////////// Rerender on maze Change

  useEffect(() => {
    // Save the state into ref for board size callback
    mazeAlgorithmStateRef.current = mazeAlgorithm

    if (slowMazeState) {
      // When the maze algorithm changes, we want to run a new maze generation.
      toggleGenerateMazeState()
    } else {
      rerenderBoard(boardSize, slowMazeStateRef);
    }
  }, [mazeAlgorithm])


  //////////////////////// Handle Board Size

  const handleEntry = useCallback((entry: ResizeObserverEntry) => {
    if(mazeAlgorithmStateRef.current === null) { return }
    let contentWidth  = Math.round(entry.contentRect.width);
    let contentHeight = Math.round(entry.contentRect.height);
    let boxCount = getBoxCount(contentWidth, contentHeight);

    if (lastBoardSize.current[0] != boxCount[0] || lastBoardSize.current[1] != boxCount[1]) {

      lastBoardSize.current = boxCount
      toggleGenerateMazeState()

      rerenderBoard(boxCount, slowMazeStateRef);
    }
  }, []);

  const resizeObserver = new ResizeObserver((entries) => {

    for (const entry of entries) {
      if (entry.contentRect) {
        handleEntry(entry)
      }
    }
  });


  //////////////////////// Set up board observer on load

  useEffect(() => {
    let elem = middleRef.current;
    if (!elem) {return}

    let observerRefValue: HTMLElement | null = null;
    if (!resizeBoardElementRef.current) {
      resizeBoardElementRef.current = elem;
      resizeObserver.observe(elem);
      observerRefValue = elem;
    }
    return () => {
      if (observerRefValue) {
        resizeObserver.unobserve(observerRefValue);
      }
    };
  }, []);


  //////////////////////// JSX

  return (
    <div className={classNames(styles.middleOuter, conditionalStyleDict(style, styleInfoList, styles))}>
      <div className={styles.middleOuter2}>
        <div className={styles.middle} ref={middleRef}>
          { newBoardGenAndgetBoardDivList(boardList, mazeAlgorithm) }
        </div>
      </div>
    </div>
  )
}
