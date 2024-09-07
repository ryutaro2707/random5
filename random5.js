let board = [];
let currentPlayer = 1; // 1 for white, 0 for black

function initBoard() {
    const boardElement = document.getElementById('board');
    board = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ({
        state: -1, // -1: unoccupied, 0: black, 1: white
        percent: Math.floor(Math.random() * 81) + 10
    })));

    boardElement.innerHTML = '';

    for (let i = 0; i < 10; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement('td');
            cell.id = `${i}-${j}`;
            cell.className = 'cell';
            cell.addEventListener('click', () => cellClick(i, j));
            row.appendChild(cell);
        }
        boardElement.appendChild(row);
    }

    updateBoard();
}

function updateBoard() {
    const cells = document.getElementsByClassName('cell');
    Array.from(cells).forEach(cell => {
        const [i, j] = cell.id.split('-').map(Number);
        const cellData = board[i][j];

        if (cellData.state === -1) {
            const probability = currentPlayer === 1
                ? 100 - cellData.percent
                : cellData.percent;
            cell.textContent = probability;
            cell.style.backgroundColor = 'beige';
        } else if (cellData.state === 0) {
            cell.style.backgroundColor = 'black';
            cell.textContent = '';
        } else if (cellData.state === 1) {
            cell.style.backgroundColor = 'white';
            cell.textContent = '';
        }
    });

    document.getElementById('turn').textContent = `Current Turn: ${currentPlayer === 1 ? 'White' : 'Black'}`;
}

function cellClick(i, j) {
    if (board[i][j].state === -1) {
        const random = Math.floor(Math.random() * 100) + 1;
        board[i][j].state = random <= board[i][j].percent ? 1 : 0;
        board[i][j].percent = 0; // Clear probability after selection
        currentPlayer = 1 - currentPlayer; // Switch player
        checkWin();
        updateBoard();
    }
}

function checkWin() {
    // Function to check for five in a row
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (board[i][j].state !== -1) {
                const state = board[i][j].state;
                if (checkDirection(i, j, 1, 0, state) || // Horizontal
                    checkDirection(i, j, 0, 1, state) || // Vertical
                    checkDirection(i, j, 1, 1, state) || // Diagonal /
                    checkDirection(i, j, 1, -1, state)) { // Diagonal \
                    alert(`${state === 1 ? 'White' : 'Black'} wins!`);
                    initBoard();
                    return;
                }
            }
        }
    }
}

function checkDirection(row, col, rowDir, colDir, state) {
    let count = 1;
    for (let i = 1; i < 5; i++) {
        const newRow = row + rowDir * i;
        const newCol = col + colDir * i;
        if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10 && board[newRow][newCol].state === state) {
            count++;
        } else {
            break;
        }
    }
    return count >= 5;
}

window.onload = initBoard;
