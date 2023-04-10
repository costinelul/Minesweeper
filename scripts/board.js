import { bombs, boardSize } from "./main_logic.js";
export let board = new Array(boardSize);

export function createBoard() {
    const boardContainer = document.createElement("div");
    boardContainer.classList.add("board-container");
    document.body.appendChild(boardContainer);

    for (let row = 0; row < boardSize; row++) {
        board[row] = new Array(boardSize);
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row-div");
        boardContainer.appendChild(rowDiv);
        for (let col = 0; col < boardSize; col++) {
            board[row][col] = " ";
            const square = document.createElement("div");
            square.classList.add("hidden");
            square.setAttribute("data-row", `r${row}`);
            square.setAttribute("data-col", `c${col}`);
            const squareWidth = 650 / boardSize;
            const squareHeight = 650 / boardSize;
            square.style.width = `${squareWidth}px`;
            square.style.height = `${squareHeight}px`;
            rowDiv.appendChild(square);
        }
    }
}

export function populateBoard(rowClicked, colClicked) {
    // plant the bombs
    for (let i = 0; i < bombs; i++) {
        let row;
        let col;
        do {
            row = Math.floor(Math.random() * boardSize);
            col = Math.floor(Math.random() * boardSize);
        } while (board[row][col] == "💣" || (row == rowClicked && col == colClicked));
        board[row][col] = "💣";
    }
    // set the numbers
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            let bombsCounter = 0;
            if (board[i][j] != "💣") {
                for (let k = i - 1; k <= i + 1; k++) {
                    for (let z = j - 1; z <= j + 1; z++) {
                        if (k >= 0 && z >= 0 && k < boardSize && z < boardSize) {
                            if (board[k][z] == "💣") bombsCounter++;
                        }
                    }
                }
                if (bombsCounter > 0) board[i][j] = bombsCounter;
            }
        }
    }
}
