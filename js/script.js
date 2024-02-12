document.addEventListener('DOMContentLoaded', function () {
    const statusDisplay = document.getElementById('status');
    const board = document.getElementById('board');
    const resetButton = document.getElementById('resetButton');
    const gameModes = document.getElementById('gameModes');
    const playerVsPlayerBtn = document.getElementById('playerVsPlayer');
    const playerVsAIBtn = document.getElementById('playerVsAI');

    let currentPlayer = "X";
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let gameActive = false;
    let playerXScore = 0;
    let playerOScore = 0;
    let mode = "";

    const winningMessage = () => `¡${currentPlayer} ha ganado!`;
    const drawMessage = () => `¡Ha habido un empate!`;
    const currentPlayerTurn = () => `Turno de ${currentPlayer}`;

    function startGame(selectedMode) {
        mode = selectedMode;
        gameActive = true;
        statusDisplay.innerHTML = currentPlayerTurn();
        gameModes.style.display = "none";
        board.style.display = "flex";
        resetButton.style.display = "flex";
    }

    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
        if (mode === "playerVsAI" && gameActive) {
            handleAIMove(); // Llamamos a la función de la IA después del turno del jugador
        }
    }

    function handleCellPlayed(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = currentPlayer;
    }

    function handleResultValidation() {
        for (let i = 0; i <= 6; i += 3) {
            const checkIfWin = gameState[i] === currentPlayer && gameState[i + 1] === currentPlayer && gameState[i + 2] === currentPlayer;
            if (checkIfWin) {
                const winningCells = [i, i + 1, i + 2];
                endGame(winningMessage(), winningCells);
                return;
            }
        }

        for (let i = 0; i < 3; i++) {
            const checkIfWin = gameState[i] === currentPlayer && gameState[i + 3] === currentPlayer && gameState[i + 6] === currentPlayer;
            if (checkIfWin) {
                const winningCells = [i, i + 3, i + 6];
                endGame(winningMessage(), winningCells);
                return;
            }
        }

        const diagonal1 = gameState[0] === currentPlayer && gameState[4] === currentPlayer && gameState[8] === currentPlayer;
        if (diagonal1) {
            const winningCells = [0, 4, 8];
            endGame(winningMessage(), winningCells);
            return;
        }

        const diagonal2 = gameState[2] === currentPlayer && gameState[4] === currentPlayer && gameState[6] === currentPlayer;
        if (diagonal2) {
            const winningCells = [2, 4, 6];
            endGame(winningMessage(), winningCells);
            return;
        }

        if (!gameState.includes("")) {
            endGame(drawMessage());
            return;
        }

        handlePlayerChange();
    }

    function endGame(message, winningCells) {
        statusDisplay.innerHTML = message;
        gameActive = false;

        // Aplicar un estilo especial a las celdas ganadoras
        // Verificar si winningCells está definido antes de usar forEach()
        if (winningCells) {
            winningCells.forEach(cellIndex => {
                const cell = document.querySelector(`[data-cell-index="${cellIndex}"]`);
                cell.classList.add('winning-cell');
                cell.removeEventListener('click', handleCellClick);
            });
        }

        // Actualizar los contadores de victorias
        if (message.includes('X ha ganado')) {
            playerXScore++;
            document.getElementById('playerXScore').textContent = playerXScore; // Actualiza el puntaje de jugador X en el HTML
        } else if (message.includes('O ha ganado')) {
            playerOScore++;
            document.getElementById('playerOScore').textContent = playerOScore; // Actualiza el puntaje de jugador O en el HTML
        }
    }

    function handlePlayerChange() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusDisplay.innerHTML = currentPlayerTurn();
    }

    function handleReset() {
        gameActive = false;
        gameState = ["", "", "", "", "", "", "", "", ""];
        board.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
        gameModes.style.display = "flex";
        board.style.display = "none";
        document.querySelectorAll('.cell').forEach(cell => {
            cell.innerHTML = "";
            cell.classList.remove('winning-cell'); // Eliminar la clase winning-cell de todas las celdas
            cell.addEventListener('click', handleCellClick); // Reactivar el evento click en todas las celdas
        });
    }

    // Agrega esta función al script.js 
    function checkWinner(position) {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // filas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columnas
            [0, 4, 8], [2, 4, 6]             // diagonales
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (position[a] && position[a] === position[b] && position[a] === position[c]) {
                return position[a]; // Devuelve el jugador que ha ganado
            }
        }

        return null; // Devuelve null si no hay ganador
    }

    function evaluate(position) {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // filas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columnas
            [0, 4, 8], [2, 4, 6]             // diagonales
        ];

        // Verificar si el jugador actual tiene una combinación ganadora
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (position[a] && position[a] === position[b] && position[a] === position[c]) {
                return position[a] === currentPlayer ? 10 : -10; // Asignar una puntuación alta si el jugador actual tiene una combinación ganadora, y una puntuación baja si el oponente tiene una combinación ganadora
            }
        }

        // Evaluar la cantidad de líneas abiertas para cada jugador
        let playerXLines = 0;
        let playerOLines = 0;
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (position[a] === '' || position[b] === '' || position[c] === '') {
                if (position[a] === 'X' || position[b] === 'X' || position[c] === 'X') {
                    playerXLines++;
                }
                if (position[a] === 'O' || position[b] === 'O' || position[c] === 'O') {
                    playerOLines++;
                }
            }
        }

        // Asignar una puntuación basada en la cantidad de líneas abiertas
        return playerXLines - playerOLines;
    }


    function minimax(position, depth, alpha, beta, maximizingPlayer) {
        if (depth === 0 || gameEnded(position)) {
            return evaluate(position); // Aquí deberías definir una función evaluate() para evaluar el tablero
        }

        if (maximizingPlayer) {
            let maxEval = -Infinity;
            for (let i = 0; i < position.length; i++) {
                if (position[i] === '') {
                    position[i] = currentPlayer;
                    const eval = minimax(position, depth - 1, alpha, beta, false);
                    position[i] = '';
                    maxEval = Math.max(maxEval, eval);
                    alpha = Math.max(alpha, eval);
                    if (beta <= alpha) {
                        break; // Podar la rama
                    }
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let i = 0; i < position.length; i++) {
                if (position[i] === '') {
                    position[i] = currentPlayer === 'X' ? 'O' : 'X';
                    const eval = minimax(position, depth - 1, alpha, beta, true);
                    position[i] = '';
                    minEval = Math.min(minEval, eval);
                    beta = Math.min(beta, eval);
                    if (beta <= alpha) {
                        break; // Podar la rama
                    }
                }
            }
            return minEval;
        }
    }

    function gameEnded(position) {
        return checkWinner(position) || !position.includes('');
    }

    function findBestMove() {
        let bestMove;
        let bestScore = -Infinity;
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === '') {
                gameState[i] = currentPlayer;
                const score = minimax(gameState, 2, false);
                gameState[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    }

    function handleAIMove() {
        const bestMoveIndex = findBestMove();
        const cell = document.querySelector(`[data-cell-index="${bestMoveIndex}"]`);
        handleCellPlayed(cell, bestMoveIndex);
        handleResultValidation();
    }


    playerVsPlayerBtn.addEventListener('click', () => startGame("playerVsPlayer"));
    playerVsAIBtn.addEventListener('click', () => startGame("playerVsAI"));
    board.addEventListener('click', handleCellClick);
    resetButton.addEventListener('click', handleReset);
    resetButton.style.display = "none";
});
