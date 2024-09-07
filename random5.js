let board = [];
let currentTurn = 0; // 0 for white, 1 for black

window.onload = function() {
    initBoard();
    updateTurnIndicator();
};

function initBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = ''; // Clear previous board

    for (let i = 0; i < 10; i++) {
        board[i] = [];
        for (let j = 0; j < 10; j++) {
            board[i][j] = {
                color: 'empty',
                probability: getRandomInt(10, 90)
            };

            const cell = document.createElement('div');
            cell.className = 'cell empty';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);

            boardElement.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    
    if (board[row][col].color === 'empty') {
        const probability = board[row][col].probability;
        board[row][col].color = Math.random() * 100 < probability ? 'black' : 'white';

        updateBoard();
        if (checkWin(row, col)) {
            alert(`Player ${currentTurn === 0 ? 'White' : 'Black'} wins!`);
            initBoard(); // Reset the board for a new game
        } else {
            currentTurn = 1 - currentTurn; // Switch turn
            updateTurnIndicator();
        }
    }
}

function updateBoard() {
    const cells = document.getElementsByClassName('cell');
    for (let cell of cells) {
        const row = cell.dataset.row;
        const col = cell.dataset.col;
        const cellData = board[row][col];

        cell.className = `cell ${cellData.color}`;
        cell.textContent = cellData.color === 'empty' ? cellData.probability + '%' : '';
    }
}

function updateTurnIndicator() {
    const turnIndicator = document.getElementById('turnIndicator');
    turnIndicator.textContent = `Turn: ${currentTurn === 0 ? 'White' : 'Black'}`;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkWin(row, col) {
    const directions = [
        { r: 1, c: 0 }, // horizontal
        { r: 0, c: 1 }, // vertical
        { r: 1, c: 1 }, // diagonal down-right
        { r: 1, c: -1 } // diagonal down-left
    ];

    const color = board[row][col].color;

    for (let dir of directions) {
        let count = 1;

        for (let step = 1; step < 5; step++) {
            const newRow = parseInt(row) + dir.r * step;
            const newCol = parseInt(col) + dir.c * step;

            if (newRow < 0 || newRow >= 10 || newCol < 0 || newCol >= 10) break;

            if (board[newRow][newCol].color === color) {
                count++;
            } else {
                break;
            }
        }

        for (let step = 1; step < 5; step++) {
            const newRow = parseInt(row) - dir.r * step;
            const newCol = parseInt(col) - dir.c * step;

            if (newRow < 0 || newRow >= 10 || newCol < 0 || newCol >= 10) break;

            if (board[newRow][newCol].color === color) {
                count++;
            } else {
                break;
            }
        }

        if (count >= 5) return true;
    }

    return false;
}
