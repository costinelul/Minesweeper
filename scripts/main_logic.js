import { createBoard, board, populateBoard } from "./board.js";
import { difficultyModes } from "./difficultyModes.js";
export let boardSize;
export let bombs;
let noTilesClicked = true;
const difficultyButtons = document.querySelectorAll("button");

difficultyButtons.forEach((button) => {
    button.addEventListener("click", startGame);
});
function startGame() {
    const mode = this.className;
    const difficulty = difficultyModes.find((el) => el.mode == mode);
    boardSize = difficulty.size;
    bombs = difficulty.bombs;
    removeMenu();
    createBoard();
    addClickListener();
}

function addClickListener() {
    const tiles = document.querySelectorAll(".hidden");
    tiles.forEach((tile) => {
        tile.addEventListener("click", handleLeftClick);
        tile.addEventListener("contextmenu", handleRightClick);
        tile.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });
    });
}
function handleRightClick() {
    if (this.classList.contains("marked")) {
        this.classList.remove("marked");
        return;
    }
    if (this.classList.contains("hidden")) this.classList.add("marked");
}
function handleLeftClick() {
    let row = +this.getAttribute("data-row").substring(1);
    let col = +this.getAttribute("data-col").substring(1);
    
    if (noTilesClicked) {
        populateBoard(row, col);
        noTilesClicked = false;
    }

    if (!this.classList.contains("marked")) dig(row, col);
}

function dig(row, col) {
    if (board[row][col] == "💣") {
        gameOver(true);
        return;
    } else discover(row, col);
    checkForWin();
}

function checkForWin() {
    const tilesLeft = document.querySelectorAll(".hidden");
    if (tilesLeft.length == bombs) gameOver(false);
}

function gameOver(gameLost) {
    const text = document.createElement("div");
    text.classList.add("game-over");
    document.body.append(text);
    text.innerHTML = gameLost ? "You've lost :(" : "You've won! :)";
    showBombs();
}

function showBombs() {
    const tilesHidden = document.querySelectorAll(".hidden");
    tilesHidden.forEach((tile) => {
        tile.removeEventListener("click", handleLeftClick);
        tile.removeEventListener("contextmenu", handleRightClick);
        let row = tile.getAttribute("data-row").substring(1);
        let col = tile.getAttribute("data-col").substring(1);
        if (board[row][col] == "💣") {
            tile.classList.add("bomb");
        }
    });
}
function discover(row, col) {
    if (board[row][col] == " ") {
        for (let rowToCheck = row - 1; rowToCheck <= row + 1; rowToCheck++) {
            for (let colToCheck = col - 1; colToCheck <= col + 1; colToCheck++) {
                if (rowToCheck >= 0 && rowToCheck < boardSize && colToCheck >= 0 && colToCheck < boardSize) {
                    const tileToCheck = document.querySelector(`[data-row=r${rowToCheck}][data-col=c${colToCheck}]`);
                    if (tileToCheck.classList.contains("hidden")) {
                        if (board[rowToCheck][colToCheck] != "💣") {
                            tileToCheck.innerHTML = board[rowToCheck][colToCheck];
                            tileToCheck.classList.remove("hidden");
                            tileToCheck.classList.remove("marked");
                            tileToCheck.classList.add("revealed");
                            tileToCheck.removeEventListener("click", handleLeftClick);
                        }
                        if (board[rowToCheck][colToCheck] == " ") {
                            discover(rowToCheck, colToCheck);
                        }
                    }
                }
            }
        }
    } else {
        const clickedTile = document.querySelector(`[data-row=r${row}][data-col=c${col}`);
        clickedTile.innerHTML = board[row][col];
        clickedTile.classList.remove("hidden");
        clickedTile.classList.remove("marked");
        clickedTile.classList.add("revealed");
        clickedTile.removeEventListener("click", handleLeftClick);
    }
}

function removeMenu() {
    document.querySelector(".customize-menu").remove();
}
