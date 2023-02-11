import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from './Middle.module.css';
import { setSearchAlgorithmStopRunning } from '@/pages/store/globalVariables';
import { useBoardStore } from "../store/boardStore";
import { useMazeAlgorithmsStore } from '../store/mazeAlgorithmsStore';
import { Block, MazeAlgorithm, MazeAlgorithmInfoList } from '@/lib/types';

export default function Middle() {
  const setBoardSize = useBoardStore((state)=>{return (size: Array<number>) => {state.setHeight(size[0]); state.setWidth(size[1])}});
  const setBoardList = useBoardStore((state)=>{return (board: Array<Block>) => {state.setBoardList(board)}});
  const boardSize: Array<number> = useBoardStore<Array<number>>((state)=>[state.board.height, state.board.width]);
  const boardList: Array<Block> = useBoardStore<Array<number>>((state)=>state.board.boardList);

  const mazeAlgorithm: MazeAlgorithm = useMazeAlgorithmsStore<MazeAlgorithm>((state)=>state.mazeAlgorithm);
  const mazeAlgorithmInfoList: MazeAlgorithmInfoList = useMazeAlgorithmsStore<MazeAlgorithmInfoList>((state)=>state.mazeAlgorithmInfoList);
  let lastBoardSize = [0, 0];

  const middleRef = useRef(null);

  const mazeAlgorithmStateRef = useRef<MazeAlgorithm | null>(null);
  mazeAlgorithmStateRef.current = mazeAlgorithm;

  const [resizeBoardElement, setResizeBoardElement] = useState<null | HTMLElement>(null);

  const rerenderBoard = (boardSize: Array<number>) => {
      
    let mazeAlgorithmFkt: null | ((height: number, width: number) => Array<Block>) = null;
    for (let mazeAlgorithmInfo of mazeAlgorithmInfoList) {
      if (mazeAlgorithmInfo.mazeAlgorithm == mazeAlgorithmStateRef.current) {
        mazeAlgorithmFkt = mazeAlgorithmInfo.algorithm;
      }
    }

    if (mazeAlgorithmFkt) {
      // lastBoardSize = boxCount
      setBoardSize(boardSize);
      let boardElements = mazeAlgorithmFkt(boardSize[0], boardSize[1])
      // console.log('setting from alg')
      setBoardList(boardElements);
    }

  }

  const handleEntry = useCallback((entry: ResizeObserverEntry) => {
    if(mazeAlgorithmStateRef.current === null) { return }
    let contentWidth  = Math.round(entry.contentRect.width);
    let contentHeight = Math.round(entry.contentRect.height);
    let boxCount = getBoxCount(contentWidth, contentHeight);

    
    if (lastBoardSize[0] != boxCount[0] || lastBoardSize[1] != boxCount[1]) {
      rerenderBoard(boxCount);
    }
  }, []);

  const resizeObserver = new ResizeObserver((entries) => {

    for (const entry of entries) {
      if (entry.contentRect) {
        handleEntry(entry)
      }
    }
  });

  
  useEffect(() => {
    rerenderBoard(boardSize);
  }, [mazeAlgorithm])

  useEffect(() => {
      if (resizeBoardElement) {
        // This is only updated when the board size actually changes.
        resizeBoardElement.style.gridTemplateRows = 'repeat(' + boardSize[1] + ', 2fr)';
      }
  }, [boardSize])

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

  return (
    <div className={styles.middleOuter}>
      <div className={styles.middleOuter2}>
        <div className={styles.middle} ref={middleRef}>
          { getrBoardDivList(boardList, mazeAlgorithm) }
        </div>
      </div>
    </div>
  )

}

function getrBoardDivList (boardList: Array<Block>, mazeAlgorithm: MazeAlgorithm): JSX.Element[] {
  setSearchAlgorithmStopRunning(true);
  let drawable = mazeAlgorithm == MazeAlgorithm.Empty;
  let divList: Array<JSX.Element> = [];
  for (let i = 0; i < boardList.length; i++) {
    let key = i + Date.now();
    if (!drawable) {
      divList.push(<BlockDiv block={boardList[i]} key={key}></BlockDiv>);
    } else {
      divList.push(<BlockDrawableDiv block={boardList[i]} index={i} key={i}></BlockDrawableDiv>);
    }
  }
  return divList;
}

interface BlockDivProps {
  block: Block
}

interface BlockDrawableDiv {
  block: Block,
  index: number
}

function BlockDiv({block}: BlockDivProps) {
  let elem: JSX.Element;
  if (block == Block.Wall) {
    elem = <div className={styles.checkbox + ' ' + styles.blockWall}/>
  } else if (block == Block.Path) {
    elem = <div className={styles.checkbox + ' ' + styles.blockPath}/>
  } else if (block == Block.Start) {
    elem = <div className={styles.checkbox + ' ' + styles.blockStart}/>
  } else if (block == Block.Finish) {
    elem = <div className={styles.checkbox + ' ' + styles.blockFinish}/>
  } else {
    elem = <div className={styles.checkbox + ' ' + styles.blockFail}/>
  }
  return elem
}

function BlockDrawableDiv({block, index}: BlockDrawableDiv) {
  const setBoardList = useBoardStore((state)=>{return (board: Array<Block>) => {state.setBoardList(board)}});
  const boardList: Array<Block> = useBoardStore<Array<number>>((state)=>state.board.boardList);

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
  } else if (block == Block.Path) {
    classname = styles.checkbox + ' ' + styles.blockPath
  } else if (block == Block.Start) {
    classname = styles.checkbox + ' ' + styles.blockStart
  } else if (block == Block.Finish) {
    classname = styles.checkbox + ' ' + styles.blockFinish
  } else {
    classname = styles.checkbox + ' ' + styles.blockFail
  }
  return (
    <div className={classname} ref={innerRef}/>
  )
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

