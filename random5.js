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
        const prob = probabilities[row][col];
        const randomValue = Math.random() * 100;

        // 確率に基づいて白か黒を決定
        const newColor = randomValue < prob ? 'black' : 'white';
        cell.classList.remove('empty');
        cell.classList.add(newColor);
        cell.textContent = '';  // 確率を消す
        board[row][col] = currentPlayer;  // プレイヤーの色をボードに保存

        // プレイヤーのターンを切り替え
        if (checkForWin(row, col)) {
            setTimeout(() => alert(`${playerColors[currentPlayer]} wins!`), 0);
            return; // 勝者が決まったらゲームを終了
        }
        currentPlayer = 1 - currentPlayer;
        updateTurnIndicator();

        // 未埋設のセルの確率を再計算
        updateProbabilities();
    } else if (cell.classList.contains('white') || cell.classList.contains('black')) {
        cell.textContent = probabilities[row][col] + "%";  // 確率を再表示
    }
}

// 5つ並んでいるか確認する関数
function checkForWin(row, col) {
    const directions = [
        { x: 1, y: 0 },  // 横
        { x: 0, y: 1 },  // 縦
        { x: 1, y: 1 },  // 斜め右下
        { x: 1, y: -1 }  // 斜め右上
    ];

    const player = board[row][col];

    for (const { x: dx, y: dy } of directions) {
        let count = 1;

        // 確認方向の前方をチェック
        for (let i = 1; i < 5; i++) {
            const newRow = row + i * dx;
            const newCol = col + i * dy;
            if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10 && board[newRow][newCol] === player) {
                count++;
            } else {
                break;
            }
        }

        // 確認方向の後方をチェック
        for (let i = 1; i < 5; i++) {
            const newRow = row - i * dx;
            const newCol = col - i * dy;
            if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10 && board[newRow][newCol] === player) {
                count++;
            } else {
                break;
            }
        }

        // 5つ並んでいるか確認
        if (count >= 5) {
            return true;
        }
    }

    return false;
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
