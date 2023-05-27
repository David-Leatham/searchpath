import React, { useState, useEffect, useRef, useCallback } from "react";

import styles from './Board.module.css';
import  { newBoardGenAndgetBoardDivList, getBoxCount } from '@/lib/elements/boardLib'

import { setSearchAlgorithmStopRunning, setSlowMazeAlgorithmStopRunning, 
  getSlowMazeAlgorithmStartRunning, setSlowMazeAlgorithmStartRunning } from '@/lib/store/globalVariables';
import { useBoardListStore, useBoardSizeStore } from "@/lib/store/boardStore";
import { useMazeAlgorithmsStore } from '@/lib/store/mazeAlgorithmsStore';
import { useStyleStore } from '@/lib/store/styleStore';
import { useGenerateMazeStateStore } from '@/lib/store/generateMazeStateStore';
import { useSlowMazeStateStore } from '@/lib/store/slowMazeStateStore';
import { Block, MazeAlgorithm, MazeAlgorithmInfoList, Style, StyleInfoList, MazeAlgAbstract } from '@/lib/types';
import classNames from 'classnames';
import { conditionalStyleDict } from '@/lib/hepers';

import { StartSlowMazeGeneration } from '@/lib/elements/lib'

import ResizeObserver from 'resize-observer-polyfill';



export default function Board() {
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
  // const generateMazeState: boolean = false;
	// const slowMazeState: boolean = false;

  let lastBoardSize = useRef<Array<number>>([0, 0]);

  const middleRef = useRef(null);

  // const genSlow = false;
  const [genSlow, setgenSlow] = useState<boolean>(false);


  const slowMazeStateRef = useRef<boolean>(slowMazeState);
  useEffect(() => {
    slowMazeStateRef.current = slowMazeState
    if (slowMazeState) {
      toggleGenerateMazeState()
    } else {
      setSlowMazeAlgorithmStopRunning(true);
      rerenderBoard(lastBoardSize.current, slowMazeStateRef);
    }
  }, [slowMazeState])

  const mazeAlgorithmStateRef = useRef<MazeAlgorithm | null>(null);
  mazeAlgorithmStateRef.current = mazeAlgorithm;

  const [resizeBoardElement, setResizeBoardElement] = useState<null | HTMLElement>(null);

  const resizeBoardElementRef = useRef<null | HTMLElement>(null);

  useEffect(() => {
    resizeBoardElementRef.current = resizeBoardElement;
  }, [resizeBoardElement])

  const rerenderBoard = (boardSize: Array<number>, slowMazeStateRef: React.MutableRefObject<boolean>) => {
    // let mazeAlgorithmTmp: null | MazeAlgorithm;
    // if (slowMazeState) {
    //   mazeAlgorithmTmp = MazeAlgorithm.Empty;
    // } else {
    //   mazeAlgorithmTmp = mazeAlgorithmStateRef.current;
    // }
      
    let mazeAlgClass: null | MazeAlgAbstract = null;
    for (let mazeAlgorithmInfo of mazeAlgorithmInfoList) {
      if (mazeAlgorithmInfo.mazeAlgorithm == mazeAlgorithmStateRef.current) {
        mazeAlgClass = mazeAlgorithmInfo.algorithm;
      }
    }
    if (mazeAlgClass) {
      // lastBoardSize = boxCount
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

  useEffect(() => {
    if (genSlow) {
      setSearchAlgorithmStopRunning(true);
      StartSlowMazeGeneration(mazeAlgorithm, mazeAlgorithmInfoList, boardSize, setBoardList);
    }
    setgenSlow(false)
  }, [genSlow])

  useEffect(() => {
    setSlowMazeAlgorithmStartRunning(true);

    if (slowMazeState) {
      setgenSlow(true)
    } else {
      rerenderBoard(boardSize, slowMazeStateRef);
    }
  }, [mazeAlgorithm, generateMazeState, slowMazeStateRef])

  //////////////////////// Handle Board Size

  const handleEntry = useCallback((entry: ResizeObserverEntry) => {
    if(mazeAlgorithmStateRef.current === null) { return }
    let contentWidth  = Math.round(entry.contentRect.width);
    let contentHeight = Math.round(entry.contentRect.height);
    let boxCount = getBoxCount(contentWidth, contentHeight);

    if (lastBoardSize.current[0] != boxCount[0] || lastBoardSize.current[1] != boxCount[1]) {

      lastBoardSize.current = boxCount
      setSearchAlgorithmStopRunning(true);
      setSlowMazeAlgorithmStopRunning(true);

      // setSlowMazeAlgorithmStartRunning(true);
      
      // if (slowMazeState) {
      //   toggleGenerateMazeState();
      // } else {
      rerenderBoard(boxCount, slowMazeStateRef);
      // toggleGenerateMazeState();
      // }
    }
  }, []);

  const resizeObserver = new ResizeObserver((entries) => {

    for (const entry of entries) {
      if (entry.contentRect) {
        handleEntry(entry)
      }
    }
  });

  //////////////////////// Handle Board Size

  // useEffect(() => {
  //     if (resizeBoardElement) {
  //       // This is only updated when the board size actually changes.
  //       resizeBoardElement.style.gridTemplateRows = 'repeat(' + boardSize[1] + ', 2fr)';
  //     }
  // }, [boardSize, lastBoardSize])

  useEffect(() => {
    let elem = middleRef.current;
    if (!elem) {return}

    let observerRefValue: HTMLElement | null = null;
    if (!resizeBoardElement) {
      setResizeBoardElement(elem)
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
