const boardSize = 10;
const board = [];
let currentTurn = 1; // 1 for white, 0 for black

window.onload = function() {
    initBoard();
    updateTurnIndicator();
}

function initBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';

    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = {
                percent: Math.floor(Math.random() * 81) + 10, // Random probability between 10% and 90%
                occupied: -1
            };
            const cell = document.createElement('div');
            cell.className = 'cell empty';
            cell.id = `${i}-${j}`;
            cell.addEventListener('click', () => handleCellClick(i, j));
            boardElement.appendChild(cell);
        }
    }

    updateBoard();
}

function handleCellClick(x, y) {
    if (board[x][y].occupied === -1) {
        const isWhiteTurn = currentTurn === 1;
        const randomValue = Math.random() * 100;

        if (randomValue < board[x][y].percent) {
            board[x][y].occupied = 1; // White
        } else {
            board[x][y].occupied = 0; // Black
        }

        updateBoard();
        if (checkWin(x, y)) {
            setTimeout(() => {
                alert(`${isWhiteTurn ? 'White' : 'Black'} wins!`);
                initBoard(); // Restart the game
            }, 100);
        } else {
            currentTurn = 1 - currentTurn; // Switch turns
            updateTurnIndicator();
        }
    }
}

function updateBoard() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.getElementById(`${i}-${j}`);
            const cellData = board[i][j];

            if (cellData.occupied === -1) {
                cell.textContent = `${currentTurn === 1 ? 100 - cellData.percent : cellData.percent}%`;
                cell.className = 'cell empty';
            } else if (cellData.occupied === 1) {
                cell.className = 'cell white';
                cell.textContent = '';
            } else {
                cell.className = 'cell black';
                cell.textContent = '';
            }
        }
    }
}

function updateTurnIndicator() {
    const turnIndicator = document.getElementById('turnIndicator');
    turnIndicator.textContent = `Current Turn: ${currentTurn === 1 ? 'White' : 'Black'}`;
}

function checkWin(x, y) {
    const directions = [
        [[0, 1], [0, -1]], // Horizontal
        [[1, 0], [-1, 0]], // Vertical
        [[1, 1], [-1, -1]], // Diagonal
        [[1, -1], [-1, 1]] // Anti-diagonal
    ];

    for (const direction of directions) {
        let count = 1;

        for (const [dx, dy] of direction) {
            for (let step = 1; step < 5; step++) {
                const newX = x + dx * step;
                const newY = y + dy * step;

                if (newX < 0 || newX >= boardSize || newY < 0 || newY >= boardSize) {
                    break;
                }

                if (board[newX][newY].occupied === board[x][y].occupied) {
                    count++;
                } else {
                    break;
                }

                if (count === 5) {
                    return true;
                }
            }
        }
    }
    return false;
}
