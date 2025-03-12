const gameBoard = (function Gameboard() {
  const gameBoardData = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ];
  const getBoardState = () => { return gameBoardData };
  const setBoardState = (player, row, column) => {
    try {
      if (
        row < 3 &&
        column < 3 &&
        gameBoardData[row][column] === ""
      ) {
        gameBoardData[row][column] = player.marker;
      }
    } catch (error) {
      console.error("[#setBoardState] error: ", error);
    }
  }
  return {
    getBoardState,
    setBoardState
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
  const player = {
    name: playerName,
    marker: playerMarker
  }
  return player
}