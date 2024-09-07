let currentPlayer = 0; // 0 for white, 1 for black
const playerColors = ['white', 'black'];
let board = Array.from({ length: 10 }, () => Array(10).fill(null));
let probabilities = Array.from({ length: 10 }, () => Array(10).fill(0));

// ボードの初期化
function initBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = ''; // ボードをリセット

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell empty';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleClick);

            // 初期確率設定
            probabilities[i][j] = Math.floor(Math.random() * 81) + 10;
            cell.textContent = probabilities[i][j] + "%";

            boardElement.appendChild(cell);
        }
    }
    updateTurnIndicator();
}
// セルがクリックされたときの処理
function handleClick(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (cell.classList.contains('empty')) {
        cell.classList.remove('empty');
        cell.classList.add(playerColors[currentPlayer]);
        cell.textContent = '';  // 確率を消す
        board[row][col] = currentPlayer;  // プレイヤーの色をボードに保存

        // プレイヤーのターンを切り替え
        checkWinCondition();
        currentPlayer = 1 - currentPlayer;
        updateTurnIndicator();

        // 未埋設のセルの確率を再計算
        updateProbabilities();
    } else if (cell.classList.contains('white') || cell.classList.contains('black')) {
        cell.textContent = probabilities[row][col] + "%";  // 確率を再表示
    }
}

// 5つ並んでいるか確認する関数
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

// 確率を再計算する関数
function updateProbabilities() {
    const cells = document.querySelectorAll('.cell.empty');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        probabilities[row][col] = Math.floor(Math.random() * 81) + 10;
        cell.textContent = probabilities[row][col] + "%";  // 追加
    });
}

// プレイヤーのターンを表示する
function updateTurnIndicator() {
    const indicator = document.getElementById('turnIndicator');
    indicator.textContent = `Player ${playerColors[currentPlayer]}'s Turn`;
}

// ページがロードされたときにボードを初期化
window.onload = initBoard;
