
// Board Types

export enum Block {
  BoardBoundary,
	Wall,
	Path,
	Start,
	Finish
}

export interface Board {
  height: number;
  width: number;
  boardList: Array<Block>;
}

export interface BoardState {
  board: Board;
  algRunning: boolean;
  setAlgRunning: (bool: boolean) => void;
  setHeight: (height: number) => void;
  setWidth: (width: number) => void;
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
  Kruskal,
  Empty
}

export interface MazeAlgorithmInfo {
  mazeAlgorithm: MazeAlgorithm,
  name: string,
  algorithm: (height: number, width: number) => Array<Block>
}

export type MazeAlgorithmInfoList = Array<MazeAlgorithmInfo>;

export interface MazeAlgorithmState {
  mazeAlgorithm: MazeAlgorithm,
  mazeAlgorithmInfoList: MazeAlgorithmInfoList,
  setMazeAlorithm: (mazeAlg: MazeAlgorithm) => void,
}

// Style types
export enum Style {
  BlueOrage,
  Dark
}

export interface StyleInfo {
  style: Style,
  name: string,
}

export type StyleInfoList = Array<StyleInfo>;

export interface StyleState {
  style: Style,
  styleInfoList: StyleInfoList,
  setStyle: (style: Style) => void,
}
