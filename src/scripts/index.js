let playerOne, playerTwo
let turn = "playerOne"

const gameBoard = (function Gameboard() {
  let gameTurnCount = 0;
  let gameBoardData = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ];
  let isGameboardFull = false;
  const getBoardState = (row, column) => {
    return gameBoardData[row][column]
  };
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
            result: "finished",
            message: `${player.name} win! 🥳`
          }
        } 
        if (!isPlayerWin && isGameboardFull) {
          return {
            result: "finished",
            message: "It's a tie! ✌️"
          }
        }
        return {
          result: "ongoing",
          message: `${player.name} placed ${player.marker} at Row: ${row+1} Col: ${column+1}`
        }
      } else {
        const mark = getBoardState(row, column);
        return {
          result: "error",
          message: `The grid at Row: ${row+1} Col: ${column+1} is already marked with ${mark}`
        }
      }
    } catch (error) {
      console.error("[#setBoardState] error: ", error);
      return {
        result: "error",
        message: error
      }
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
  const resetGameboard = () => {
    gameBoardData = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ];
    gameTurnCount = 0;
    isGameboardFull = false;
  }
  // Expose the function(s) outside
  return {
    getBoardState,
    setBoardState,
    resetGameboard
  };
})()

const displayController = (function DisplayController() {
  const gridMapping = {
    one: [0, 0],
    two: [0, 1],
    three: [0, 2],
    four: [1, 0],
    five: [1, 1],
    six: [1, 2],
    seven: [2, 0],
    eight: [2, 1],
    nine: [2, 2]
  }
  const setGridMarker = (player, eventObject) => {
    try {
      const gridId = eventObject.target.id.split("-").pop();
      const row = gridMapping[gridId][0];
      const column = gridMapping[gridId][1];
      const result = gameBoard.setBoardState(player, row, column);
      if (result.result !== "error") eventObject.target.textContent = player.marker;
      return result
    } catch (error) {
      console.error("[#setGridMarker] error: ", error);
    }
  }
  const resetGridDisplay = () => {
    const gridElements = document.getElementsByClassName("gameboard-grid-item");
    if (gridElements) {
      for (const gridElement of gridElements) {
        gridElement.textContent = "";
      }
    }
  }
  // Expose the function(s) outside
  return {
    setGridMarker,
    resetGridDisplay
  }
})()

function playGame(event) {
  const outputGameInfo = document.getElementById("output-game-info");
  let result
  if (turn === "playerOne") {
    result = displayController.setGridMarker(playerOne, event);
    console.log(result);
    outputGameInfo.value = result.message;
  } else {
    result = displayController.setGridMarker(playerTwo, event);
    console.log(result);
    outputGameInfo.value = result.message;
  }
  if (result.result === "finished") removeGridEventListener();
  if (result.result === "ongoing") turn = turn === "playerOne" ? "playerTwo" : "playerOne";
}

function addGridEventListener() {
  const gridElements = document.getElementsByClassName("gameboard-grid-item");
  if (gridElements) {
    for (const gridElement of gridElements) {
      gridElement.addEventListener("click", playGame);
    }
  }
}

function removeGridEventListener() {
  const gridElements = document.getElementsByClassName("gameboard-grid-item");
  if (gridElements) {
    for (const gridElement of gridElements) {
      gridElement.removeEventListener("click", playGame);
    }
  }
}

function showStartButton() {
  const buttonStartGame = document.getElementById("button-start-game");
  const buttonResetGame = document.getElementById("button-reset-game");
  buttonStartGame.style.display = "block";
  buttonResetGame.style.display = "none";
}

function showResetButton() {
  const buttonStartGame = document.getElementById("button-start-game");
  const buttonResetGame = document.getElementById("button-reset-game");
  buttonStartGame.style.display = "none";
  buttonResetGame.style.display = "block";
}

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

// On DOM mounted
document.addEventListener("DOMContentLoaded", function() {
  const inputPlayerOne = document.getElementById("input-player-one");
  const inputPlayerTwo = document.getElementById("input-player-two");
  const outputGameInfo = document.getElementById("output-game-info");
  const buttonStartGame = document.getElementById("button-start-game");
  const buttonResetGame = document.getElementById("button-reset-game");
  const buttonDialogConfirm = document.getElementById("button-dialog-confirm");
  const buttonDialogCancel = document.getElementById("button-dialog-cancel");
  const dialogConfirm = document.getElementById("dialog-confirm");
  const textDialog = document.getElementById("dialog-text");
  buttonStartGame.addEventListener("click", () => {
    if (playerOne || playerTwo) {
      outputGameInfo.value = "Game on!";
      addGridEventListener();
      showResetButton();
      return
    }
    playerOne = createPlayer(inputPlayerOne.value, "X");
    playerTwo = createPlayer(inputPlayerTwo.value, "O");
    if (playerOne.error !== undefined) {
      console.error("Can't use empty name for 'Player 1'!");
      outputGameInfo.value = "Can't use empty name for 'Player 1'!";
      return
    }
    if (playerTwo.error !== undefined) {
      console.error("Can't use empty name for 'Player 2'!");
      outputGameInfo.value = "Can't use empty name for 'Player 2'!";
      return
    }
    outputGameInfo.value = "Game on!";
    addGridEventListener();
    showResetButton();
  });
  buttonResetGame.addEventListener("click", () => {
    textDialog.textContent = "Are you sure you want to reset the game?";
    dialogConfirm.showModal(); // Show confirm dialog
  });
  buttonDialogConfirm.addEventListener("click", () => {
    turn = "playerOne";
    displayController.resetGridDisplay();
    gameBoard.resetGameboard();
    outputGameInfo.value = "Game board reset!";
    removeGridEventListener();
    showStartButton();
    dialogConfirm.close(); // Close confirm dialog
  });
  buttonDialogCancel.addEventListener("click", () => {
    dialogConfirm.close(); // Close confirm dialog
  });
})