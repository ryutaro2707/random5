const boardSize = 10;
let board = [];
let currentTurn = 0; // 0: white, 1: black

// Initialize the board
function initBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';

    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = { percent: -1, OI: -1 };
            const cell = document.createElement('div');
            cell.className = 'cell empty';
            cell.id = `cell-${i}-${j}`;
            cell.addEventListener('click', () => handleClick(i, j));
            boardElement.appendChild(cell);
        }
    }
    updateBoard();
    updateTurnIndicator();
}

// Update the board display
function updateBoard() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`);
            if (board[i][j].OI === -1) {
                // Display probability for unselected cells
                cell.textContent = `${board[i][j].percent}%`;
                cell.className = 'cell empty';
            } else if (board[i][j].OI === 0) {
                // Black cell
                cell.textContent = '';
                cell.className = 'cell black';
            } else if (board[i][j].OI === 1) {
                // White cell
                cell.textContent = '';
                cell.className = 'cell white';
            }
        }
    }
}

// Handle cell click
function handleClick(x, y) {
    if (board[x][y].OI === -1) {
        // Set probability and determine color
        board[x][y].percent = (Math.random() * 80 + 10).toFixed(0);
        board[x][y].OI = Math.random() * 100 < board[x][y].percent ? 1 : 0;
        updateBoard();
        if (checkWin(x, y)) {
            alert(`${currentTurn === 0 ? 'White' : 'Black'} wins!`);
            initBoard(); // Restart the game
        } else {
            currentTurn = 1 - currentTurn; // Switch turn
            updateTurnIndicator();
        }
    }
}

// Update turn indicator
function updateTurnIndicator() {
    const turnElement = document.getElementById('turnIndicator');
    turnElement.textContent = `Current Turn: ${currentTurn === 0 ? 'White' : 'Black'}`;
}

// Check if there's a win
function checkWin(x, y) {
    const directions = [
        [[0, 1], [0, -1]], // Horizontal
        [[1, 0], [-1, 0]], // Vertical
        [[1, 1], [-1, -1]], // Diagonal /
        [[1, -1], [-1, 1]]  // Diagonal \
    ];

    for (const direction of directions) {
        let count = 1;
        for (const [dx, dy] of direction) {
            let nx = x + dx;
            let ny = y + dy;
            while (nx >= 0 && ny >= 0 && nx < boardSize && ny < boardSize && board[nx][ny].OI === board[x][y].OI) {
                count++;
                if (count === 5) return true;
                nx += dx;
                ny += dy;
            }
        }
    }
    return false;
}

// Initialize the board on page load
window.onload = initBoard;
