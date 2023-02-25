
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