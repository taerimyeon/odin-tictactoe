const gameBoard = (function Gameboard() {
  let gameTurnCount = 0;
  let gameBoardData = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ];
  let isGameboardFull = false;
  const getBoardState = () => { return gameBoardData };
  const setBoardState = (player, row, column) => {
    try {
      if (
        row < 3 &&
        column < 3 &&
        gameBoardData[row][column] === ""
      ) {
        gameBoardData[row][column] = player.marker;
        const isPlayerWin = checkGameStatus(player, row, column);
        if (isPlayerWin) {
          return {
            result: `${player.name} win!`
          }
        } 
        if (!isPlayerWin && isGameboardFull) {
          return {
            result: "It's a tie!"
          }
        }
      }
    } catch (error) {
      console.error("[#setBoardState] error: ", error);
    }
  }
  const checkGameStatus = (player, row, column) => {
    try {
      gameTurnCount++;
      isGameboardFull = gameTurnCount === 9;
      if (checkRow(player, row)) return true;
      if (checkColumn(player, column)) return true;
      if (checkDiagonal(player)) return true;
    } catch (error) {
      console.error("[#checkGameStatus] error: ", error);
    }
  }
  const checkRow = (player, row) => {
    const currentRowData = gameBoardData.slice(row, row+1).flat();
    return currentRowData.every(element => element === player.marker);
  }
  const checkColumn = (player, column) => {
    const currentColumnData = gameBoardData.map(data => data[column]);
    return currentColumnData.every(element => element === player.marker);
  }
  const checkDiagonal = (player) => {
    const firstDiagonal = [gameBoardData[0][0], gameBoardData[1][1], gameBoardData[2][2]];
    const secondDiagonal = [gameBoardData[2][0], gameBoardData[1][1], gameBoardData[0][2]];
    if (firstDiagonal.every(element => element === player.marker)) return true;
    if (secondDiagonal.every(element => element === player.marker)) return true;
  }
  const clearGameboard = () => {
    gameBoardData = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ];
    gameTurnCount = 0;
    isGameboardFull = false;
  }
  return {
    getBoardState,
    setBoardState,
    clearGameboard
  };
})()

function createPlayer(playerName, playerMarker) {
  if (playerMarker !== "O" && playerMarker !== "X") {
    return {
      error: "Must use 'O' or 'X' as markers!"
    }
  }
  if (playerName === "") {
    return {
      error: "Can't use empty name!"
    }
  }
  return {
    name: playerName,
    marker: playerMarker
  }
}