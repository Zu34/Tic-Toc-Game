
//required elements
const selectBox = document.querySelector(".select-box"),
  selectBtnX = selectBox.querySelector(".options .playerX"),
  selectBtnO = selectBox.querySelector(".options .playerO"),
  playBoard = document.querySelector(".play-board"),
  players = document.querySelector(".players"),
  allBox = document.querySelectorAll("section span"),
  resultBox = document.querySelector(".result-box"),
  wonText = resultBox.querySelector(".won-text"),
  replayBtn = document.querySelector(".btn button"),
  scoreX = document.querySelector(".score-x"),
  scoreO = document.querySelector(".score-o"),
  roundCount = document.querySelector(".round-count");

// Variables - game state
let playerXIcon = "fas fa-times"; // FontAwesome icon class for 'X'
let playerOIcon = "far fa-circle"; // FontAwesome icon class for 'O'
let playerSign = "X";
let runBot = true;
let gameOver = false; // Flag to track game over state
let score = { X: 0, O: 0 }; // Track scores for each player
let currentRound = 1; // Track the current round
const maxRounds = 5; // Total number of rounds

// Initialize the game
window.onload = () => {
  allBox.forEach((box) => {
    box.addEventListener("click", () => handleBoxClick(box));
  });

  replayBtn.addEventListener("click", () => resetGame(true));

  selectBtnX.addEventListener("click", () => handlePlayerSelect("X"));
  selectBtnO.addEventListener("click", () => handlePlayerSelect("O"));
};

// Player X selection
function handlePlayerSelect(player) {
  selectBox.classList.add("hide");
  playBoard.classList.add("show");
  if (player === "O") {
    players.classList.add("active", "player");
  }
}

// Handle user click
function handleBoxClick(element) {
  if (gameOver) return;

  if (players.classList.contains("player")) {
    playerSign = "O";
    element.innerHTML = `<i class="${playerOIcon}"></i>`;
    element.style.backgroundColor = "#00bcd4"; // Color for O's move (you can adjust the color)
    players.classList.remove("active");
  } else {
    playerSign = "X";
    element.innerHTML = `<i class="${playerXIcon}"></i>`;
    element.style.backgroundColor = "#ff5722"; // Color for X's move (you can adjust the color)
    players.classList.add("active");
  }
  element.setAttribute("id", playerSign);
  element.style.pointerEvents = "none";

  selectWinner()
    .then((winner) => {
      if (winner === "draw") {
        handleRoundEnd("draw");
      } else {
        handleRoundEnd(winner);
      }
    })
    .catch(() => {
      if (!gameOver && runBot) {
        playBoard.style.pointerEvents = "none";
        setTimeout(() => bot(), Math.floor(Math.random() * 1000) + 200);
      }
    });
}


// Bot logic
function bot() {
  if (gameOver || !runBot) return;

  const availableBoxes = [...allBox].filter((box) => !box.childElementCount);
  console.log("Available Boxes:", availableBoxes);

  if (availableBoxes.length === 0) return;

  const bestMove = availableBoxes[Math.floor(Math.random() * availableBoxes.length)];

  console.log("Bot selected box:", bestMove);

  setTimeout(() => {
    const botSign = players.classList.contains("player") ? "X" : "O";
    makeMove(bestMove, botSign);

    selectWinner()
      .then((winner) => {
        if (winner === "draw") {
          handleRoundEnd("draw");
        } else {
          handleRoundEnd(winner);
        }
      })
      .catch(() => {
        if (!gameOver) playBoard.style.pointerEvents = "auto";
      });
  }, Math.floor(Math.random() * 1000) + 200);
}

// Make a move
function makeMove(box, sign) {
  if (!box) return;

  box.innerHTML = `<i class="${sign === "X" ? playerXIcon : playerOIcon}"></i>`;
  box.setAttribute("id", sign);
  if (sign === "X") {
    box.classList.add("x-color"); // Add color for X
  } else {
    box.classList.add("o-color"); // Add color for O
  }
  box.style.pointerEvents = "none";
  players.classList.toggle("active");
}


// Function to get the value of a box (X or O)
function getIdVal(index) {
  const box = allBox[index - 1]; // Adjust if needed, as the index in arrays starts at 0
  return box.getAttribute('id'); // Make sure it returns 'X' or 'O'
}

// Function to check for a winner
function selectWinner() {
  return new Promise((resolve, reject) => {
    const winningCombinations = [
      [1, 2, 3], [4, 5, 6], [7, 8, 9], // Rows
      [1, 4, 7], [2, 5, 8], [3, 6, 9], // Columns
      [1, 5, 9], [3, 5, 7],            // Diagonals
    ];

    let winnerFound = false;

    winningCombinations.forEach(combination => {
      const [a, b, c] = combination;

      // Log the values of the boxes involved in the combination
      console.log(`Checking combination: ${a}, ${b}, ${c}`);
      console.log(`a: ${getIdVal(a)}, b: ${getIdVal(b)}, c: ${getIdVal(c)}`);

      if (getIdVal(a) && getIdVal(a) === getIdVal(b) && getIdVal(b) === getIdVal(c)) {
        winnerFound = true;
        gameOver = true;
        resolve(getIdVal(a)); // Resolve with the winner ('X' or 'O')
      }
    });

    if (!winnerFound) {
      const allFilled = [...allBox].every(box => box.childElementCount);
      if (allFilled) {
        gameOver = true;
        showFlashMessage("It's a draw! 🤦‍♀️ <br><strong>Next round starting...</strong>");
        setTimeout(() => resetGame(false), 3000);
        resolve("draw");
      } else {
        reject(); // Reject if the game is still ongoing
      }
    }
  });
}


// Display result message
function showFlashMessage(message, duration = 3000) {
  wonText.innerHTML = message;
  resultBox.classList.add("show");

  setTimeout(() => {
    resultBox.classList.remove("show");
    wonText.innerHTML = "";
  }, duration);
}

// Handle round end
function handleRoundEnd(result) {
  if (result === "X" || result === "O") {
    score[result]++;
    if (score[result] === 3) {
      showFlashMessage(`${result} scored a point the match! 🎉`);
    } else {
      showFlashMessage(`${result} wins this round! 🎉`);
    }
  } else if (result === "draw") {
    showFlashMessage("It's a draw! 🤝");
  }

  updateScores();

  if (score.X === 3 || score.O === 3 || currentRound === maxRounds) {
    declareFinalWinner();
  } else {
    currentRound++;
    setTimeout(() => resetGame(false), 3000);
  }
}

// Update scores in the UI
function updateScores() {
  scoreX.textContent = score.X;
  scoreO.textContent = score.O;
  roundCount.textContent = currentRound;
}

// Declare final winner
function declareFinalWinner() {
  const finalWinner =
    score.X > score.O
      ? `Player X wins the match! 🎊`
      : score.O > score.X
      ? `Player O wins the match! 🎊`
      : "It's a tie! 🤝";

  wonText.innerHTML = `
    ${finalWinner}<br>
    Final Scores:<br>
    Player X: ${score.X} | Player O: ${score.O}
  `;
  resultBox.classList.add("show");
  playBoard.classList.remove("show");

  selectBox.classList.add("hide");

  setTimeout(() => {
    resetGame(true);
    selectBox.classList.remove("hide");
  }, 5000);
}




// Reset the game
function resetGame(fullReset = false) {
  gameOver = false;
  runBot = true;
  playerSign = "X";

  // Clear the symbols (X/O) from the cells and reset the background to white
  allBox.forEach((box) => {
    box.innerHTML = ""; // Remove X/O symbol
    box.removeAttribute("id"); // Remove the player's mark (X/O)
    box.style.pointerEvents = "auto"; // Re-enable click events
    box.style.backgroundColor = "white"; // Set background to white (default color)
  });

  // If it's a full reset, reset the score and round count
  if (fullReset) {
    score = { X: 0, O: 0 }; // Reset scores
    currentRound = 1; // Reset round count
    updateScores(); // Update UI with reset scores
  }

  // Optionally, hide the result box and show the select player screen
  resultBox.classList.remove("show");
  // selectBox.classList.remove("hide");
}
