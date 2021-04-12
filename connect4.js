/** Connect Four
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let winningCells;

const upDatePlayer = (num) => {
  if (document.getElementById("currentPlayer")) {
    document.getElementById("currentPlayer").remove()
  }
  let playerDiv = document.createElement('div');
  let header = document.querySelector(".header");
  let currPlayerStatus = document.createElement('h1');

  playerDiv.setAttribute("id", "currentPlayer")
  currPlayerStatus.setAttribute("class", "currentPlayerStatus")
  currPlayerStatus.innerText = `PLAYER ${currPlayer}'s TURN`

  header.append(playerDiv)
  playerDiv.append(currPlayerStatus)

  currPlayer == 1 ? currPlayerStatus.style.color = "blue" : currPlayerStatus.style.color = "red"
}


const makeBoard = () => {
  for (let i = 0; i < HEIGHT; i++) {
    board.push(new Array(WIDTH));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */
const makeHtmlBoard = () => {
  const htmlBoard = document.querySelector("#board");

  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }

  htmlBoard.append(top);

  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
const findSpotForCol = (x) => {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (board[y][x] == undefined) { return y }
  }
  return null;
}


const placeInTable = (y, x) => {
  let token = document.createElement("div");
  let destination = document.getElementById(`${y}-${x}`);

  token.setAttribute("class", `player${currPlayer} piece`);
  destination.append(token);

  setTimeout(() => {
    token.classList.toggle("drop")
  }, 10)

}


function endOfGameAlert(msg) {
  // TODO: pop up alert message
  setTimeout(() => {
    alert(msg)
  }, 900)
}


function handleClick(evt) {
  let x = +evt.target.id;

  let y = findSpotForCol(x);
  if (y === null) {
    alert(`column is full, you can not play there, try again! `)
    return;
  }

  board[y][x] = currPlayer;
  placeInTable(y, x);

  if (checkForWin()) {
    let winningDiv = document.createElement('div');
    winningDiv.classList.add("endGameDiv")
    document.querySelector('body').append(winningDiv);

    winningCells.forEach((cell) => {
      let [y, x] = cell;
      setInterval(() => {
        document.getElementById(`${y}-${x}`).classList.toggle('winning-chips')
      }, 500);
    })

    let restartButton = document.createElement('button');
    restartButton.innerText = "RESTART"
    restartButton.classList.add("endGameButton")
    document.querySelector('.endGameDiv').append(restartButton);
    restartButton.addEventListener('click', () => {
      restart();
    })

    return endOfGameAlert(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  // don't actually have to check ALL cells, just cells in the top row
  if (checkForTie()) { return endOfGameAlert(`it's a tie!`); }


  currPlayer == 1 ? currPlayer = 2 : currPlayer = 1
  upDatePlayer(currPlayer)
}

/*
check if any of the top row of slots remains unfilled. if any are unfilled 
the game continues/ no tie. however if the for loop completes, that means all
slots in top row are filled. Since the check for a winner is called prior that means
there arent any more available slots and noone has won - tie!
*/
const checkForTie = () => {
  for (let i = 1; i <= WIDTH; i++) {
    if (board[0][WIDTH - i] == undefined) { return false }
  }
  return true
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

const checkForWin = () => {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    winningCells = cells
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  //iterate through coordinates  from 0,0 to HEIGHT,WIDTH
  //  horiz = put those coordinates and the 3  coordinated to the right in an array
  //  vert =  put those coordinates and the 3  coordinates above into an array
  // diagDR = put those coordinates and the 3 up and to the right into an array
  // diagDL = put those coordinates and the 3 up and to the left into an array
  //pass those arrays to the _win function which uses those as positions on the board
  //checks that the coordinates are positions on the board and also checks to see
  //if all elements are the same
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz)) {
        return true;
      }
      else if (_win(vert)) {
        return true
      }
      else if (_win(diagDR)) {
        return true
      }
      else if (_win(diagDL)) {
        return true
      }
    }
  }
}

const breakBoardDown = () => {
  let tr = document.querySelectorAll("tr"); // grab all table rows
  let arr = new Array(tr)
  for (item of arr[0]) {
    item.remove()
  }
  board = [];
}



const restart = () => {
  var highestTimeoutId = setTimeout(";");
  for (var i = 0; i < highestTimeoutId; i++) {
    clearTimeout(i);
  }


  breakBoardDown(); // completely break down old game and pieces
  makeHtmlBoard(); // remake the visual board
  makeBoard(); //reset array grid monitoring pieces on the board
  document.querySelector(".endGameDiv").remove() // remove div shield stopping further play
}

makeBoard();
makeHtmlBoard();
upDatePlayer(1)
