import React, { useState, useEffect, useRef } from "react";

import styles from '@/styles/Home.module.css'

export default function Middle() {
  const [boardSize, setBoardSize] = useState([0, 0]);
  // const middleDivRef = useRef(null);
  const [resizeBoard, setResizeBoard] = useState<null | HTMLElement>(null);

  const resizeObserver = new ResizeObserver((entries) => {

    for (const entry of entries) {
      if (entry.contentRect) {
        setBoardSize(getBoxCount(Math.round(entry.contentRect.width), entry.contentRect.height));
      }
    }
  });

  useEffect(() => {
    if (resizeBoard) {
      resizeBoard.style.gridTemplateRows = 'repeat(' + boardSize[1] + ', 2fr)'
    }
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
    <div className={styles.middle}>
      { getrDivList(boardSize) }
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