import React, { useState, useEffect, useRef } from "react";
import styles from './Middle.module.css';
import { setSearchAlgorithmStopRunning } from '@/pages/store/globalVariables';
// import global_styles from '@/styles/globals.css'
import { useBoardStore } from "../store/boardStore";
import { generateKruskal } from "@/lib/kruskal";
import { Block } from '@/lib/types'
// import { shallow } from 'zustand/shallow'


export default function Middle() {
  const setBoardSize = useBoardStore((state)=>{return (size: Array<number>) => {state.setHeight(size[0]); state.setWidth(size[1])}});
  const setBoardList = useBoardStore((state)=>{return (board: Array<Block>) => {state.setBoardList(board)}});
  const boardSize: Array<number> = useBoardStore<Array<number>>((state)=>[state.board.height, state.board.width]);
  const boardList: Array<Block> = useBoardStore<Array<number>>((state)=>state.board.boardList);

  let lastBoardSize = [0, 0];

  const [resizeBoardElement, setResizeBoardElement] = useState<null | HTMLElement>(null);

  function handleEntry(entry: ResizeObserverEntry): void {
    let contentWidth  = Math.round(entry.contentRect.width);
    let contentHeight = Math.round(entry.contentRect.height);
    let boxCount = getBoxCount(contentWidth, contentHeight);
    
    if (lastBoardSize[0] != boxCount[0] || lastBoardSize[1] != boxCount[1]) {
      lastBoardSize = boxCount
      setBoardSize(boxCount);
      let boardElements = generateKruskal(boxCount[0], boxCount[1])
      setBoardList(boardElements);
    }
  }


  const resizeObserver = new ResizeObserver((entries) => {

    for (const entry of entries) {
      if (entry.contentRect) {
        handleEntry(entry)
      }
    }
  });

  useEffect(() => {
      if (resizeBoardElement) {
        // This is only updated when the board size actually changes.
        resizeBoardElement.style.gridTemplateRows = 'repeat(' + boardSize[1] + ', 2fr)'
      }
  }, [boardSize])

  useEffect(() => {
    let observerRefValue: HTMLElement | null = null;
    if (typeof window !== 'undefined') {
      let elem = document.getElementsByClassName(styles.middle)[0] as HTMLElement
      if (!resizeBoardElement) {
        setResizeBoardElement(elem)
        resizeObserver.observe(elem);
        observerRefValue = elem;
      }
    }
    return () => {
      if (observerRefValue) {
        resizeObserver.unobserve(observerRefValue);
      }
    };
  }, []);

  return (
    <div className={styles.middleOuter}>
      <div className={styles.middleOuter2}>
        <div className={styles.middle}>
          { getrDivList(boardList) }
        </div>
      </div>
    </div>
  )

}

function getrDivList (boardList: Array<Block>) {
  setSearchAlgorithmStopRunning(true);
  let divList: Array<JSX.Element> = [];
  for (let i = 0; i < boardList.length; i++) {
      
    let elem: JSX.Element;
    if (boardList[i] == Block.Wall) {
      elem = <div className={styles.checkbox + ' ' + styles.blockWall} key={i + Date.now()}/>
    } else if (boardList[i] == Block.Path) {
      elem = <div className={styles.checkbox + ' ' + styles.blockPath} key={i + Date.now()}/>
    } else if (boardList[i] == Block.Start) {
      elem = <div className={styles.checkbox + ' ' + styles.blockStart} key={i + Date.now()}/>
    } else if (boardList[i] == Block.Finish) {
      elem = <div className={styles.checkbox + ' ' + styles.blockFinish} key={i + Date.now()}/>
    } else {
      elem = <div className={styles.checkbox + ' ' + styles.blockFail} key={i + Date.now()}/>
    }
    divList.push(elem);
  }
  return divList;
}

function getBoxCount(width: number, height: number) {
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

