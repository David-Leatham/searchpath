export enum Block {
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
  setHeight: (height: number) => void;
  setWidth: (width: number) => void;
  setBoardList: (boardList: Array<Block>) => void;
}

export interface SearchPath {
	searchList: Array<number>;
	shortestPath: Array<number>;
}