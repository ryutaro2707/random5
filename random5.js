/**
 * 
 */
// ゲームボードを初期化
let currentPlayer = 0; // 0 for white, 1 for black
const playerColors = ['white', 'black'];
let probabilities = Array.from({ length: 10 }, () => Array(10).fill(0));

// ボードの初期化
function initBoard() {
    const board = document.getElementById('board');
    board.innerHTML = ''; // ボードをリセット

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

            board.appendChild(cell);
        }
    }

    updateTurnIndicator();
}

// セルがクリックされたときの処理
function handleClick(event) {
    const cell = event.target;
    const row = cell.dataset.row;
    const col = cell.dataset.col;

    if (cell.classList.contains('empty')) {
        cell.classList.remove('empty');
        cell.classList.add(playerColors[currentPlayer]);
        cell.textContent = '';  // 確率を消す
    } else if (cell.classList.contains('white') || cell.classList.contains('black')) {
        cell.textContent = probabilities[row][col] + "%";  // 確率を再表示
    }

    // プレイヤーのターンを切り替え
    currentPlayer = 1 - currentPlayer;
    updateTurnIndicator();

    // 未埋設のセルの確率を再計算
    updateProbabilities();
}

// 確率を再計算する関数
function updateProbabilities() {
    const cells = document.querySelectorAll('.cell.empty');
    cells.forEach(cell => {
        const row = cell.dataset.row;
        const col = cell.dataset.col;
        probabilities[row][col] = Math.floor(Math.random() * 81) + 10;
        cell.textContent = probabilities[row][col] + "%";
    });
}

// プレイヤーのターンを表示する
function updateTurnIndicator() {
    const indicator = document.getElementById('turnIndicator');
    indicator.textContent = `Player ${playerColors[currentPlayer]}'s Turn`;
}

// ページがロードされたときにボードを初期化
window.onload = initBoard;
