const game = createGame("Player 1", "Player 2");

function createGame(p1, p2) {
  let gameboard = blankBoard();
  let round = 0;
  let winFlag = false;
  const player1 = createPlayer(p1, "X");
  const player2 = createPlayer(p2, "O");
  const display = createDisplay([p1, p2]);
  const getScore = () =>
    (score = `${player1.getScore()} - ${player2.getScore()}`);

  function blankBoard() {
    // Fills the gameboard with * items
    let board = [[], [], []];

    board.forEach((column) => {
      for (let index = 0; index < 3; index++) {
        column[index] = "*";
      }
    });
    return board;
  }

  function resetGameBoard() {
    winFlag = false;
    round = 0;
    console.log(getScore());
    gameboard = blankBoard();
  }

  function playRound(row, column) {
    // Decides witch player goes p1 = X and p2 = O
    let currentPlayer = round % 2 === 0 ? player1 : player2;
    let symbolPlaced = "*";

    if (gameboard[row][column] === "*") {
      // Place the tile of the current player, increase the round and check win condition is met
      gameboard[row][column] = currentPlayer.getIcon();
      round++;
      symbolPlaced = currentPlayer.getIcon();
      winFlag = checkWinner(currentPlayer.getIcon(), row, column);
    } else {
      console.log("ERROR tile already ocuppied");
    }

    // Shows board
    console.table(gameboard);

    // Show the winner and reset de board
    if (winFlag) {
      console.log(`${currentPlayer.name} WON`);
      currentPlayer.increaseScore();
      resetGameBoard();
    } else {
      // Check for ties
      if (checkTie()) {
        console.log(`It's a TIE`);
        resetGameBoard();
      }
    }

    return symbolPlaced;
  }

  function checkTie() {
    const length = gameboard.length;
    let hasSpaceLeft = false;

    for (let row = 0; !hasSpaceLeft && row < length; row++) {
      for (let column = 0; !hasSpaceLeft && column < length; column++) {
        hasSpaceLeft = gameboard[row][column] === "*";
      }
    }
    return !hasSpaceLeft;
  }

  function checkWinner(icon, row, column) {
    const length = gameboard.length;
    let flag = false;
    let auxArr = [];

    // Check the row
    flag = areEquals(gameboard[row], icon, length);

    if (!flag) {
      // Check the column
      for (let i = 0; i < length; i++) {
        auxArr.push(gameboard[i][column]);
      }
      flag = areEquals(auxArr, icon, length);
    }
    // Check diagonal
    if (!flag) {
      auxArr = [];
      if (
        row === column ||
        (row === 0 && column === 2) ||
        (column === 0 && row === 2)
      ) {
        // Top left to bottom right
        for (let i = 0; i < length; i++) {
          auxArr.push(gameboard[i][i]);
        }
        flag = areEquals(auxArr, icon, length);

        // Botton left to top right
        if (!flag) {
          auxArr = [];
          let j = length - 1;

          for (let i = 0; i < length; i++) {
            auxArr.push(gameboard[i][j]);
            j--;
          }
          flag = areEquals(auxArr, icon, length);
        }
      }
    }
    return flag;
  }

  function areEquals(arr, icon, length) {
    let aux = arr.filter((item) => item === icon);
    return aux.length === length;
  }

  return { round, getScore, playRound, gameboard };
}

function createPlayer(playerName, playerIcon) {
  const name = playerName;
  const icon = playerIcon;
  let score = 0;

  const getIcon = () => icon;
  const getScore = () => score;
  const getName = () => name;
  const setName = (newName) => (name = newName);
  const increaseScore = () => score++;
  const resetScore = () => (score = 0);

  return { getName, setName, getIcon, getScore, increaseScore, resetScore };
}

function createDisplay(nameArray) {
  const container = document.querySelector(".container");
  const scoreDisplay = document.createElement("div");
  const playerNames = document.createElement("div");
  const gameboard = document.createElement("div");

  gameboard.classList.add("gameboard");
  scoreDisplay.classList.add("score");
  playerNames.classList.add("playerNames");

  container.appendChild(playerNames);
  container.appendChild(scoreDisplay);
  container.appendChild(gameboard);

  updateScore(0, 0);
  createGameboardDisplay();
  createPlayerPlates();

  function createPlayerPlates() {
    for (let i = 0; i < 2; i++) {
      let namePlate = document.createElement("div");
      namePlate.classList.add("playerName");
      namePlate.setAttribute("id", `${i + 1}`);
      namePlate.textContent = nameArray[i];
      playerNames.appendChild(namePlate);
    }
  }

  function updateName(playerId, newName) {
    let plate = playerNames.getElementById(playerId);
    plate.textContent = newName;
  }

  function updateScore(scoreP1, scoreP2) {
    scoreDisplay.textContent = `${scoreP1}  - ${scoreP2}`;
  }

  function createGameboardDisplay() {
    const size = 3;
    let indexRow;
    let row, btn;

    for (indexRow = 0; indexRow < size; indexRow++) {
      row = document.createElement("div");
      row.classList.add("row");
      gameboard.appendChild(row);

      // adds cells
      for (let indexBtn = 0; indexBtn < size; indexBtn++) {
        btn = document.createElement("button");
        btn.classList.add("cell");
        btn.textContent = "";
        addCellProperties(btn, indexRow, indexBtn);

        row.appendChild(btn);
      }
    }
  }

  function addCellProperties(cell, row, column) {
    cell.addEventListener("click", function () {
      let symbol = game.playRound(row, column);

      if (symbol != "*") {
        // Change later to a png or something else to look prettier
        cell.textContent = symbol;
      }
    });
  }

  function resetDisplayCells() {
    let cells = document.getElementsByClassName("cell");

    for (let i = 0; i < cells.length; i++) {
      cells[i].textContent = "";
    }
  }

  return { updateName, updateScore, resetDisplayCells };
}
