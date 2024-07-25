function createGame(p1, p2) {
  const gameboard = createGameboard().blankBoard();
  let round = 0;
  let score = "";
  let winFlag = false;
  const player1 = createPlayer(p1, "X");
  const player2 = createPlayer(p2, "O");
  const getScore = () =>
    (score = `${player1.getScore()} - ${player2.getScore()}`);

  function playRound(row, column) {
    // Decides witch player goes p1 = X and p2 = O
    let currentPlayer = round % 2 === 0 ? player1 : player2;

    if (gameboard[row][column] === "*") {
      // Place the tile of the current player, increase the round and check win condition is met
      gameboard[row][column] = currentPlayer.getIcon();
      round++;
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
      console.log(getScore());
      gameboard = blankBoard();
    }
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

function createGameboard() {
  const board = [[], [], []];

  function blankBoard() {
    // Fills the gameboard with * items
    this.board.forEach((column) => {
      for (let index = 0; index < 3; index++) {
        column[index] = "*";
      }
    });
  }

  return { board, blankBoard };
}

function createPlayer(playerName, playerIcon) {
  const name = playerName;
  const icon = playerIcon;
  let score = 0;

  const getIcon = () => icon;
  const getScore = () => score;
  const increaseScore = () => score++;
  const resetScore = () => (score = 0);

  return { name, getIcon, getScore, increaseScore, resetScore };
}
