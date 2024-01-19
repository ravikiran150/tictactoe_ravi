document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const resultModal = document.getElementById('result-modal');
    const resultMessage = document.getElementById('result-message');
    const newGameBtn = document.getElementById('new-game-btn');
    
    // Separate Audio elements for each player
    const player1Sound = new Audio('mixkit-falling-into-mud-surface-385.wav');
    const player2Sound = new Audio('mixkit-cartoon-clown-fun-nose-sound-528.wav');

    const cells = Array.from({ length: 9 }, (_, index) => createCell(index));

    cells.forEach(cell => board.appendChild(cell));

    let currentPlayer = Math.random() < 0.5 ? '😄' : '🤪'; // Randomize starting player
    let gameBoard = Array(9).fill('');

    function createCell(index) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', () => handleCellClick(index));
        return cell;
    }

    function handleCellClick(index) {
        if (gameBoard[index] === '' && !checkWinner()) {
            gameBoard[index] = currentPlayer;
            cells[index].textContent = currentPlayer;

            // Play sound based on the current player
            currentPlayer === '😄' ? player1Sound.play() : player2Sound.play();

            currentPlayer = currentPlayer === '😄' ? '🤪' : '😄';

            // Add a visual indicator for the current player
            cells.forEach(cell => cell.style.backgroundColor = '');
            cells[index].style.backgroundColor = currentPlayer === '😄' ? 'lightgreen' : 'lightblue';

            if (checkWinner() || checkDraw()) {
                openResultModal();
                // Disable further clicks
                cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
            }
        }
    }

    function checkWinner() {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        for (const condition of winConditions) {
            const [a, b, c] = condition;
            if (gameBoard[a] !== '' && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                return true;
            }
        }

        return false;
    }

    function checkDraw() {
        if (!gameBoard.includes('')) {
            return true;
        }

        return false;
    }

    function openResultModal() {
        if (checkWinner()) {
            resultMessage.textContent = `Player ${gameBoard[0]} wins!`;
        } else {
            resultMessage.textContent = 'It\'s a draw!';
        }

        resultModal.style.display = 'flex';
    }

    function closeResultModal() {
        resultModal.style.display = 'none';
    }

    function resetGame() {
        gameBoard = Array(9).fill('');
        currentPlayer = Math.random() < 0.5 ? '😄' : '🤪'; // Randomize starting player
        cells.forEach(cell => {
            cell.textContent = '';
            cell.style.backgroundColor = '';
            cell.addEventListener('click', () => handleCellClick(cells.indexOf(cell))); // Re-enable clicks
        });
        closeResultModal();
    }

    newGameBtn.addEventListener('click', resetGame);

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === resultModal) {
            closeResultModal();
        }
    });
});
