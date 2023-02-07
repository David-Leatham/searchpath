import React, { useState, useEffect, useRef } from "react";
import styles from '@/styles/Home.module.css';
// import global_styles from '@/styles/globals.css'
import { useBoardStore } from "./store/boardStore";
import { generateKruskal, Block } from "@/lib/kruskal";
// import { shallow } from 'zustand/shallow'


export default function Middle() {
  const setBoardSize = useBoardStore((state)=>{return (size: Array<number>) => {state.setHeight(size[0]); state.setWidth(size[1])}})
  const boardSize: Array<number> = useBoardStore<Array<number>>((state)=>[state.board.height, state.board.width])

  let lastBoardSize = [0, 0];

  const [resizeBoard, setResizeBoard] = useState<null | HTMLElement>(null);

  function handleEntry(entry: ResizeObserverEntry): void {
    let contentWidth  = Math.round(entry.contentRect.width);
    let contentHeight = Math.round(entry.contentRect.height);

    let boxCount = getBoxCount(contentWidth, contentHeight);
    
    if (lastBoardSize[0] != boxCount[0] || lastBoardSize[1] != boxCount[1]) {
      lastBoardSize = boxCount
      setBoardSize(boxCount);
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
    // if (currBoardSize[0] != boardSize[0] || currBoardSize[1] != boardSize[1]) {
      console.log('change')
      // setCurrBoardSize(boardSize)
      if (resizeBoard) {
        // This is only updated when the board size actually changes.
        resizeBoard.style.gridTemplateRows = 'repeat(' + boardSize[1] + ', 2fr)'
        let boardElements = generateKruskal(boardSize[0], boardSize[1])
        
        for (let i=0; i < boardSize[0] * boardSize[1]; i++) {
          let elem = document.getElementsByClassName(styles.middle)[0].children.item(i) as HTMLElement
          if (boardElements[i] == Block.Wall) {
            elem.style.background = 'black';
            elem.style.transform = 'rotate(90deg)';
          } else if (boardElements[i] == Block.Path) {
            elem.style.background = 'rgb(220, 220, 220)';
            elem.style.transform = 'rotate(0deg)';
          } else if (boardElements[i] == Block.Start) {
            elem.style.background = 'rgb(0, 51, 102)';
            elem.style.transform = 'rotate(90deg)';
          } else if (boardElements[i] == Block.Finish) {
            elem.style.background = 'rgb(51, 0, 102)';
            elem.style.transform = 'rotate(90deg)';
          }
        }
      }
    // }
  }, [boardSize])

  useEffect(() => {
    let observerRefValue: HTMLElement | null = null;
    if (typeof window !== 'undefined') {
      let elem = document.getElementsByClassName(styles.middle)[0] as HTMLElement
      if (!resizeBoard) {
        setResizeBoard(elem)

        console.log(elem)
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
      <div className={styles.middle}>
        { getrDivList(boardSize) }
      </div>
    </div>
  )

}

function getrDivList (arr: Array<number>) {
  let divList: Array<JSX.Element> = [];
  for (let i = 0; i < arr[1]; i++) {
    for (let j = 0; j < arr[0]; j++) {
      divList.push(<div className={styles.checkbox} key={j + i * arr[0]}/>);
    }
  }
  return divList;
}

function getBoxCount(width: number, height: number) {
  let boxSize = 25;
  let distance = 5;
  let horizontalCount = Math.floor((width) / (boxSize + distance))
  // console.log(width - (boxSize + distance) * horizontalCount + distance)
  if ( width - (boxSize + distance) * horizontalCount + distance >= boxSize) {
    horizontalCount += 1
  }
  let verticalCount = Math.floor((height) / (boxSize + distance))
  // console.log(height, (boxSize + distance) * verticalCount + distance)
  // if ( height - (boxSize + distance) * verticalCount >= boxSize) {
  //   verticalCount += 1
  // }
  return [horizontalCount, verticalCount]
}

