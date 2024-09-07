document.addEventListener('DOMContentLoaded', (event) => {
    const boardSize = 10;
    const board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(-1));
    let currentPlayer = 1; // 1 for white, 0 for black

    const boardContainer = document.getElementById('board');

    function initBoard() {
        boardContainer.innerHTML = '';
        for (let row = 0; row < boardSize; row++) {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('row');
            for (let col = 0; col < boardSize; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => handleClick(row, col));
                rowDiv.appendChild(cell);
            }
            boardContainer.appendChild(rowDiv);
        }
        updateProbabilities();
    }

    function handleClick(row, col) {
        if (board[row][col] === -1) {
            const randomProb = Math.floor(Math.random() * 81) + 10;
            const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            if (Math.random() * 100 < randomProb) {
                board[row][col] = currentPlayer;
                cell.classList.remove('empty');
                cell.classList.add(currentPlayer === 1 ? 'white' : 'black');
                cell.textContent = '';  // Remove probability display
            } else {
                cell.classList.add('empty');
                cell.textContent = '';  // Remove probability display
            }
            updateProbabilities();  // Update probabilities for all cells
            checkForWin(row, col);
            currentPlayer = 1 - currentPlayer; // Switch player
        }
    }

    function updateProbabilities() {
        // No longer needed, probabilities are now only used for determining cell state
    }

    function checkForWin(row, col) {
        const directions = [
            { dr: 0, dc: 1 },  // horizontal
            { dr: 1, dc: 0 },  // vertical
            { dr: 1, dc: 1 },  // diagonal (down-right)
            { dr: 1, dc: -1 }  // diagonal (down-left)
        ];

        for (let { dr, dc } of directions) {
            let count = 1;
            for (let i = 1; i < 5; i++) {
                const r = row + dr * i;
                const c = col + dc * i;
                if (r < 0 || r >= boardSize || c < 0 || c >= boardSize) break;
                if (board[r][c] === currentPlayer) {
                    count++;
                } else {
                    break;
                }
            }
            for (let i = 1; i < 5; i++) {
                const r = row - dr * i;
                const c = col - dc * i;
                if (r < 0 || r >= boardSize || c < 0 || c >= boardSize) break;
                if (board[r][c] === currentPlayer) {
                    count++;
                } else {
                    break;
                }
            }
            if (count >= 5) {
                setTimeout(() => alert(`${currentPlayer === 1 ? 'White' : 'Black'} wins!`), 0);
                return;
            }
        }
    }

    initBoard();
});
