import React, { useState, useEffect, useRef, useCallback } from "react";

import styles from '@/pages/templates/Board.module.css';
import { Block, MazeAlgorithm } from '@/lib/types';

import { useBoardListStore, useBoardSizeStore } from "@/lib/store/boardStore";

export function newBoardGenAndgetBoardDivList(boardList: Array<Block>, mazeAlgorithm: MazeAlgorithm): JSX.Element[]  {
    let drawable = mazeAlgorithm == MazeAlgorithm.Empty;
    let divList: Array<JSX.Element> = [];
  
    for (let i = 0; i < boardList.length; i++) {
      if (!drawable) {
        divList.push(<BlockDiv block={boardList[i]} key={i}></BlockDiv>);
      } else {
        divList.push(<BlockDrawableDiv block={boardList[i]} index={i} key={i}></BlockDrawableDiv>);
      }
    }
    return divList;
  }
  
  
  interface BlockDivProps {
    block: Block
  }
  
  interface BlockDrawableDivInput {
    block: Block,
    index: number
  }
  
  function BlockDiv({block}: BlockDivProps) {
    let elem: JSX.Element;
    if (block == Block.Wall || Block.BoardBoundary) {
      elem = <div className={styles.checkbox + ' ' + styles.blockWall}/>
    } else if (block == Block.BoardBoundary) {
      elem = <div className={styles.checkbox + ' ' + styles.BoardBoundary}/>
    } else if (block == Block.Path) {
      elem = <div className={styles.checkbox + ' ' + styles.blockPath}/>
    } else if (block == Block.Start) {
      elem = <div className={styles.checkbox + ' ' + styles.blockStart}/>
    } else if (block == Block.Finish) {
      elem = <div className={styles.checkbox + ' ' + styles.blockFinish}/>
    } else if (block == Block.AlgSaving) {
      elem = <div className={styles.checkbox + ' ' + styles.blockAlgSaving}/>
    } else if (block == Block.AlgSearched) {
      elem = <div className={styles.checkbox + ' ' + styles.blockAlgSearched}/>
    } else if (block == Block.AlgSolutionPath) {
      elem = <div className={styles.checkbox + ' ' + styles.blockAlgSolutionPath}/>
    } else {
      elem = <div className={styles.checkbox + ' ' + styles.blockFail}/>
    }
    return elem
  }
  
  function BlockDrawableDiv({block, index}: BlockDrawableDivInput) {
    const setBoardList = useBoardListStore((state)=>{return (board: Array<Block>) => {state.setBoardList(board)}});
    const boardList: Array<Block> = useBoardListStore<Array<number>>((state)=>state.boardList);
  
    const boardListRef = useRef<Array<Block>>(boardList);
    const innerRef = useRef<HTMLDivElement>(null);
  
    boardListRef.current = boardList;
  
    useEffect(() => {
      const div = innerRef.current;
      if (div) {
        div.addEventListener("mouseenter",  (event) => {changeStateMouseEnter(event)});
        div.addEventListener("click", changeState);
        return () => {
          // unsubscribe events
          div.addEventListener("mouseenter",  (event) => {changeStateMouseEnter(event)});
          div.removeEventListener("click", changeState);
        };
      }
    }, []);
  
    const changeStateMouseEnter = (event: MouseEvent) => {
      if (event.buttons === 1) {
        changeState(event)
      }
    }
  
    const changeState = (event: MouseEvent) => {
      let boardList = boardListRef.current
      if (boardListRef.current[index] == Block.Wall) {
        boardList[index] = Block.Path
        setBoardList(boardList)
      } else if (boardListRef.current[index] == Block.Path) {
        boardList[index] = Block.Wall
        setBoardList(boardList)
      }
    }
    let classname: string = '';
    if (block == Block.Wall) {
      classname = styles.checkbox + ' ' + styles.blockWall
    } else if (block == Block.BoardBoundary) {
      classname = styles.checkbox + ' ' + styles.BoardBoundary
    } else if (block == Block.Path) {
      classname = styles.checkbox + ' ' + styles.blockPath
    } else if (block == Block.Start) {
      classname = styles.checkbox + ' ' + styles.blockStart
    } else if (block == Block.Finish) {
      classname = styles.checkbox + ' ' + styles.blockFinish
    } else if (block == Block.AlgSaving) {
      classname = styles.checkbox + ' ' + styles.blockAlgSaving
    } else if (block == Block.AlgSearched) {
      classname = styles.checkbox + ' ' + styles.blockAlgSearched
    } else if (block == Block.AlgSolutionPath) {
      classname = styles.checkbox + ' ' + styles.blockAlgSolutionPath
    } else {
      classname = styles.checkbox + ' ' + styles.blockFail
    }
    return (
      <div className={classname} ref={innerRef}/>
    )
  }
  
  export function getBoxCount(width: number, height: number) {
    let boxSize = 25;
    let distance = 2;
    let horizontalCount = Math.floor((width) / (boxSize + distance))
    if ( width - (boxSize + distance) * horizontalCount + distance >= boxSize) {
      horizontalCount += 1
    }
    let verticalCount = Math.floor((height) / (boxSize + distance))
    // if ( height - (boxSize + distance) * verticalCount >= boxSize) {
    //   verticalCount += 1
    // }
    return [horizontalCount, verticalCount]
  }