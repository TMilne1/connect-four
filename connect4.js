/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])


/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x]) */
const makeBoard=()=>{
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  board = new Array(HEIGHT) // can't use .fill(new Array(HEIGHT)), 
  for(let i=0; i<HEIGHT; i++){
    board[i] = new Array(WIDTH)
  }
}


/** makeHtmlBoard: make HTML table and row of column tops. */
const makeHtmlBoard = ()=>{
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector("#board");

  // TODO: add comment for this code
  //create a table row element , give it an id of comlumn-top and add a click event listener
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // for the numbers from 0 up to the size of the width, count
  //create a table data element, give it an id of <the current count> then add it to the table row 
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }

  // append the previously created table row, with all its table data to the html board
  htmlBoard.append(top);

  // TODO: add comment for this code
  // for the numbers from 0 up to the size of the height, count (call it y)
  //create a table row element then count again from 0 up to the size of the width (call it x)
  //create a table data element, give it an id of the current y concat x count (creates coordinates)
  //add the table data element to the tr, after all table data and rows have been created 
  //add them to the html board 
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
const findSpotForCol=(x)=>{
  if(x>HEIGHT){return null}
  // TODO: write the real version of this, rather than always returning 0
  
  let tableRows = document.querySelectorAll("#board tr");
  for(let i = 0; HEIGHT-i>0; i++){
    if(tableRows[HEIGHT - i].children[x].innerHTML==''){
      return HEIGHT-i-1;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
const placeInTable=(y, x)=> {
  // TODO: make a div and insert into correct table cell
  let token = document.createElement("div");
  token.setAttribute("class", `player${currPlayer} piece`);
  let destination = document.getElementById(`${y}-${x}`);
  
  destination.append(token);
  setTimeout(()=>{
    token.classList.toggle("drop")
  },10)
  

}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg)
  
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    alert(`column is full, you can not play there, try again! `)
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  // don't actually have to check ALL cells, just cells in the top row
 if(checkForTie()){
   return endGame(`it's a tie!`);
 }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  //We already have an alert set up for an invalid play, 
  //so if we reach this part in the function just need to focus on switching players
  if(currPlayer==1){
    currPlayer=2
  }else{
    currPlayer=1
  }
}

/*
check if any of the top row of slots remains unfilled. if any are unfilled 
there game continues/ no tie. however if the for loop completes, that means all
slots in top row are filled. Since wecheck for win is called prior that means
there arent any more available slots and noone has won - tie!
*/
const checkForTie=()=>{
  for (let i = 1; i <= WIDTH; i++) {
    if(board[0][WIDTH - i]==undefined){return false}
  }
  return true
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

const checkForWin=()=> {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y,x]) =>
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

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
