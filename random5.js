let currentTurn = 0; // 0 for white, 1 for black
let probabilities = Array.from({ length: 10 }, () => Array(10).fill(0)); // Probabilities for cells

function initBoard() {
    const board = document.getElementById('board');
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell empty';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleClick);
            board.appendChild(cell);
            updateProbabilityDisplay(i, j); // Display initial probabilities
        }
    }
    updateTurnIndicator(); // Initialize turn indicator
}

function updateProbabilityDisplay(row, col) {
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    cell.textContent = `${Math.round(probabilities[row][col])}%`;
}

function updateTurnIndicator() {
    const turnIndicator = document.getElementById('turnIndicator');
    turnIndicator.textContent = `Turn: ${currentTurn === 0 ? 'White' : 'Black'}`;
}

function handleClick(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    // Check if the cell is empty
    if (cell.classList.contains('empty')) {
        const isWhiteTurn = currentTurn === 0;
        const randomProbability = Math.random() * 100;
        probabilities[row][col] = randomProbability; // Update probability

        // Determine color based on probability
        if (randomProbability < 50) {
            cell.classList.remove('empty');
            cell.classList.add(isWhiteTurn ? 'white' : 'black');
        } else {
            cell.classList.remove('empty');
            cell.classList.add(isWhiteTurn ? 'black' : 'white');
        }
        cell.textContent = '';

        // Update probability display for all cells
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                updateProbabilityDisplay(i, j);
            }
        }

        // Toggle turn
        currentTurn = 1 - currentTurn;
        updateTurnIndicator(); // Update turn indicator after each move

        checkWinCondition();
    }
}

function checkWinCondition() {
    const cells = document.querySelectorAll('.cell');
    const board = [];
    for (let i = 0; i < 10; i++) {
        board[i] = [];
        for (let j = 0; j < 10; j++) {
            const cell = cells[i * 10 + j];
            board[i][j] = cell.classList.contains('white') ? 1 : (cell.classList.contains('black') ? 2 : 0);
        }
    }

    function isWinningLine(line) {
        return line.every(cell => cell === line[0] && cell !== 0);
    }

    function checkDirection(row, col, dRow, dCol) {
        const line = [];
        for (let k = 0; k < 5; k++) {
            const r = row + k * dRow;
            const c = col + k * dCol;
            if (r < 0 || r >= 10 || c < 0 || c >= 10) return false;
            line.push(board[r][c]);
        }
        return isWinningLine(line);
    }

    function checkWin() {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (
                    checkDirection(i, j, 0, 1) ||  // Horizontal
                    checkDirection(i, j, 1, 0) ||  // Vertical
                    checkDirection(i, j, 1, 1) ||  // Diagonal /
                    checkDirection(i, j, 1, -1)    // Diagonal \
                ) {
                    alert((currentTurn === 0 ? 'White' : 'Black') + ' wins!');
                    return;
                }
            }
        }
    }

    checkWin();
}

window.onload = initBoard;
