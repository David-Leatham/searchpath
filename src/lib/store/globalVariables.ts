// global Variables for search algorithm

let globalSearchAlgorithmStopRunning: boolean = false;
let globalSearchAlgorithmRunning: boolean = false;

export function setSearchAlgorithmStopRunning(bool: boolean): void {
  globalSearchAlgorithmStopRunning = bool;
}

export function getSearchAlgorithmStopRunning(): boolean {
  return globalSearchAlgorithmStopRunning;
}

export function setSearchAlgorithmRunning(bool: boolean): void {
  globalSearchAlgorithmRunning = bool;
}

export function getSearchAlgorithmRunning(): boolean {
  return globalSearchAlgorithmRunning;
}

// global Variables for slow maze algorithm

let globalSlowMazeAlgorithmStopRunning: boolean = false;
let globalSlowMazeAlgorithmStartRunning: boolean = false;
let globalSlowMazeAlgorithmRunning: boolean = false;

export function setSlowMazeAlgorithmStopRunning(bool: boolean): void {
  globalSlowMazeAlgorithmStopRunning = bool;
}

export function getSlowMazeAlgorithmStopRunning(): boolean {
  return globalSlowMazeAlgorithmStopRunning;
}

export function setSlowMazeAlgorithmStartRunning(bool: boolean): void {
  globalSlowMazeAlgorithmStartRunning = bool;
}

export function getSlowMazeAlgorithmStartRunning(): boolean {
  return globalSlowMazeAlgorithmStartRunning;
}

export function setSlowMazeAlgorithmRunning(bool: boolean): void {
  globalSlowMazeAlgorithmRunning = bool;
}

export function getSlowMazeAlgorithmRunning(): boolean {
  return globalSlowMazeAlgorithmRunning;
}