// Equality checks

export function isEqual(pos1: Position, pos2: Position): boolean {
  return pos1.heightCoord === pos2.heightCoord && pos1.widthCoord === pos2.widthCoord;
}

// Board Types

export interface Position {
  heightCoord: number;
  widthCoord: number;
}

export enum Block {
  BoardBoundary,
	Wall,
	Path,
	Start,
	Finish,
  AlgSaving
}

export interface Board {
  height: number;
  width: number;
  boardList: Array<Block>;
}

export interface BoardState {
  board: Board;
  // algRunning: boolean;
  // setAlgRunning: (bool: boolean) => void;
  setHeight: (height: number) => void;
  setWidth: (width: number) => void;
  setBoardList: (boardList: Array<Block>) => void;
}

export interface BoardSize {
  height: number;
  width: number;
}

export interface BoardSizeState {
  boardSize: BoardSize;
  setHeight: (height: number) => void;
  setWidth: (width: number) => void;
}

export interface BoardListState {
  boardList: Array<Block>;
  setBoardList: (boardList: Array<Block>) => void;
}

// Algorithm Types

export interface SearchPath {
	searchList: Array<number>;
	shortestPath: Array<number>;
}

// SearchAlgorithm Types

export enum SearchAlgorithm {
  DijkstraDepthFirst,
  DijkstraWidthFirst
}

export interface SearchAlgorithmInfo {
  searchAlgorithm: SearchAlgorithm,
  name: string,
  algorithm: (board: Board) => SearchPath
}

export type SearchAlgorithmInfoList = Array<SearchAlgorithmInfo>;

export interface SearchAlgorithmState {
  searchAlgorithm: SearchAlgorithm,
  searchAlgorithmInfoList: SearchAlgorithmInfoList,
  setSearchAlorithm: (searchAlg: SearchAlgorithm) => void,
}

// Mazre Algorithm Types

export enum MazeAlgorithm {
  // Kruskal,
  Empty,
  RecursiveDivision,
  RecursiveBacktracking
}

export interface MazeAlgorithmInfo {
  mazeAlgorithm: MazeAlgorithm,
  name: string,
  // algorithm: (height: number, width: number) => Array<Block>
  algorithm: MazeAlgAbstract
}

export type MazeAlgorithmInfoList = Array<MazeAlgorithmInfo>;

export interface MazeAlgorithmState {
  mazeAlgorithm: MazeAlgorithm,
  mazeAlgorithmInfoList: MazeAlgorithmInfoList,
  setMazeAlorithm: (mazeAlg: MazeAlgorithm) => void,
}

// Slow Maze State

export interface SlowMazeState {
  slowMazeState: boolean,
  toggleSlowMazeState: () => void,
}

// Generate Maze Toggle

export interface GenerateMazeState {
  generateMazeState: boolean,
  toggleGenerateMazeState: () => void,
}

// Style types
export enum Style {
  BlueOrage,
  Dark,
  NoWalls
}

export interface StyleInfo {
  style: Style,
  name: string,
  cssTag: string
}

export type StyleInfoList = Array<StyleInfo>;

export interface StyleState {
  style: Style,
  styleInfoList: StyleInfoList,
  setStyle: (style: Style) => void,
}


// Maze Algorithm
export interface MazeChangeBlock {
  block: Block;
  position: number;
}

export abstract class MazeAlgAbstract {
  height: number;
  width: number;
  constructor () {
    this.height = 0;
    this.width = 0;
  }

  abstract generateMaze(height: number, width: number): Array<Block>;
  abstract getMazeBase(height: number, width: number): Array<Block> | null;
  abstract getMazeChanges(height: number, width: number): Array<Array<MazeChangeBlock>> | null;

  setHeightWidth(height: number, width: number) {
    this.height = height;
    this.width = width;
  }
}
