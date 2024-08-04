const game = createGame("Player 1", "Player 2");
const startBtn = document.querySelector(".start");

startBtn.addEventListener("click", function () {
  game.resetGameBoard();
  // Change text button if it was restart
  if (this.textContent === "Restart") {
    this.textContent = this.getAttribute("txt-original");
  }
});

function createGame(p1, p2) {
  let gameboard = blankBoard();
  let round = 0;
  let winFlag = false;
  const player1 = createPlayer(p1, "X");
  const player2 = createPlayer(p2, "O");
  const playerArray = [player1, player2];
  const display = createDisplay(playerArray);
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

  function updatePlayerName(newName, id) {
    playerArray[id].setName(newName);
    display.updateName(id, newName);
  }

  function resetGameBoard() {
    winFlag = false;
    round = 0;
    gameboard = blankBoard();
    display.resetDisplayCells();
  }

  function playRound(row, column) {
    // Decides witch player goes p1 = X and p2 = O
    let currentPlayer = round % 2 === 0 ? player1 : player2;
    let symbolPlaced = false,
      playerIcon = currentPlayer.getIcon();

    if (winFlag) {
      alert("Reset the board to play again");
    } else {
      if (gameboard[row][column] === "*") {
        // Place the tile of the current player, increase the round and check win condition is met
        gameboard[row][column] = playerIcon;
        display.updateCell(playerIcon, `${row},${column}`);
        round++;
        symbolPlaced = true;
        changeBtnText();
        winFlag = checkWinner(playerIcon, row, column);
      } else {
        // Change for pop up msg
        alert("ERROR tile already ocuppied");
      }

      // Show the winner and update score
      if (winFlag) {
        alert(`${currentPlayer.getName()} WON`);
        currentPlayer.increaseScore();
        display.updateScore(player1.getScore(), player2.getScore());
      } else {
        // Check for ties
        if (checkTie()) {
          alert(`It's a TIE`);
        }
      }
    }

    return symbolPlaced;
  }

  function changeBtnText() {
    if (startBtn.textContent === startBtn.getAttribute("txt-original")) {
      startBtn.textContent = startBtn.getAttribute("txt-swap");
    }
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

  return {
    round,
    getScore,
    playRound,
    resetGameBoard,
    updatePlayerName,
    gameboard,
  };
}

function createPlayer(playerName, playerIcon) {
  const icon = playerIcon;
  let name = playerName;
  let score = 0;

  const getIcon = () => icon;
  const getScore = () => score;
  const getName = () => name;
  const setName = (newName) => (name = newName);
  const increaseScore = () => score++;
  const resetScore = () => (score = 0);

  return { getName, setName, getIcon, getScore, increaseScore, resetScore };
}

function createDisplay(playerArray) {
  const container = document.querySelector(".container");
  const scoreDisplay = document.createElement("div");
  const playerNames = document.createElement("div");
  const gameboard = document.createElement("div");

  gameboard.classList.add("gameboard", "round");
  scoreDisplay.classList.add("score", "greenColor", "neonText");
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
      namePlate.classList.add("playerName", "neonText");
      i === 1
        ? namePlate.classList.toggle("redColor")
        : namePlate.classList.toggle("blueColor");

      namePlate.textContent = playerArray[i].getName();
      namePlate.setAttribute("id", `${i}`);
      namePlate.addEventListener("click", function () {
        let userInput = prompt("Enter new name");
        if (userInput != null) {
          game.updatePlayerName(userInput, this.getAttribute("id"));
        }
      });
      playerNames.appendChild(namePlate);
    }
  }

  function updateName(playerId, newName) {
    let plate = document.getElementById(playerId);
    plate.textContent = newName;
  }

  function updateScore(scoreP1, scoreP2) {
    scoreDisplay.textContent = `${scoreP1}  - ${scoreP2}`;
  }

  function createGameboardDisplay() {
    const size = 3;
    let indexRow;
    let btn;

    for (indexRow = 0; indexRow < size; indexRow++) {
      // adds cells
      for (let indexBtn = 0; indexBtn < size; indexBtn++) {
        btn = document.createElement("button");
        btn.classList.add("cell", "round", "neonText");
        btn.setAttribute("id", `${indexRow},${indexBtn}`);
        btn.textContent = "";
        addCellProperties(btn, indexRow, indexBtn);

        gameboard.appendChild(btn);
      }
    }
  }

  function addCellProperties(cell, row, column) {
    cell.addEventListener("click", function () {
      let roundPlayed = game.playRound(row, column);

      if (roundPlayed) {
        gameboard.classList.toggle("redColor");
      }
    });
  }

  function updateCell(symbol, cellId) {
    let cell = document.getElementById(cellId);
    cell.textContent = symbol;
    symbol === "O"
      ? cell.classList.toggle("redColor")
      : cell.classList.toggle("blueColor");
  }

  function resetDisplayCells() {
    let cells = document.querySelectorAll(".cell");

    for (let i = 0; i < cells.length; i++) {
      cells[i].textContent = "";
      cells[i].classList.toggle("redColor", false);
      cells[i].classList.toggle("blueColor", false);
    }

    gameboard.classList.toggle("redColor", false);
  }

  return { updateName, updateScore, updateCell, resetDisplayCells };
}
