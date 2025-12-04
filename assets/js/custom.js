/**
 * Lab 5: Custom JavaScript for Contact Form
 * Handles form processing, validation, and result display
 */

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Setup phone number masking
    const phoneInput = document.getElementById('formPhone');
    if (phoneInput) {
      phoneInput.addEventListener('input', formatPhoneNumber);
      phoneInput.addEventListener('keydown', handlePhoneKeydown);
    }
    
    // Real-time validation on all fields
    const formInputs = contactForm.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea, input[type="range"]');
    formInputs.forEach(input => {
      input.addEventListener('blur', validateField);
      input.addEventListener('input', validateField);
    });
    
    // Initialize submit button state
    updateSubmitButtonState();
  }
});

/**
 * Handle form submission
 * @param {Event} e - Form submit event
 */
function handleFormSubmit(e) {
  e.preventDefault();
  
  // Collect form data
  const formData = {
    name: document.getElementById('formName').value.trim(),
    surname: document.getElementById('formSurname').value.trim(),
    email: document.getElementById('formEmail').value.trim(),
    phone: document.getElementById('formPhone').value.trim(),
    address: document.getElementById('formAddress').value.trim(),
    rating1: parseInt(document.getElementById('formRating1').value),
    rating2: parseInt(document.getElementById('formRating2').value),
    rating3: parseInt(document.getElementById('formRating3').value)
  };
  
  // Validate form data
  if (!validateFormData(formData)) {
    showErrorAlert('Please fill in all required fields correctly.');
    return;
  }
  
  // Log to console
  console.log('Form Data:', formData);
  
  // Display results below the form
  displayResults(formData);
  
  // Calculate and display average rating
  const averageRating = (formData.rating1 + formData.rating2 + formData.rating3) / 3;
  displayAverageRating(formData.name, formData.surname, averageRating);
  
  // Show success popup
  showSuccessPopup();
  
  // Reset form
  document.getElementById('contactForm').reset();
  
  // Reset rating values display
  document.getElementById('ratingValue1').textContent = '5';
  document.getElementById('ratingValue2').textContent = '5';
  document.getElementById('ratingValue3').textContent = '5';
}

/**
 * Validate all form data
 * @param {Object} data - Form data object
 * @returns {boolean} - True if valid, false otherwise
 */
function validateFormData(data) {
  // Name validation (letters only)
  if (!data.name || !/^[a-zA-Z\s]+$/.test(data.name)) {
    return false;
  }
  
  // Surname validation (letters only)
  if (!data.surname || !/^[a-zA-Z\s]+$/.test(data.surname)) {
    return false;
  }
  
  // Email validation
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return false;
  }
  
  // Phone validation (non-empty and has enough digits)
  const phoneDigits = data.phone.replace(/\D/g, '');
  if (!data.phone || phoneDigits.length < 11) {
    return false;
  }
  
  // Address validation (non-empty and meaningful)
  if (!data.address || data.address.length < 5) {
    return false;
  }
  
  // Rating validation (1-10 range)
  if (data.rating1 < 1 || data.rating1 > 10 || 
      data.rating2 < 1 || data.rating2 > 10 || 
      data.rating3 < 1 || data.rating3 > 10) {
    return false;
  }
  
  return true;
}

/**
 * Display form results below the form
 * @param {Object} data - Form data object
 */
function displayResults(data) {
  let resultsContainer = document.getElementById('formResults');
  
  // Create results container if it doesn't exist
  if (!resultsContainer) {
    const form = document.getElementById('contactForm');
    resultsContainer = document.createElement('div');
    resultsContainer.id = 'formResults';
    resultsContainer.className = 'form-results mt-4 p-4 bg-light rounded';
    form.parentElement.insertAdjacentElement('afterend', resultsContainer);
  }
  
  // Build results HTML
  const resultsHTML = `
    <h4>Form Results:</h4>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Surname:</strong> ${escapeHtml(data.surname)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Phone number:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Address:</strong> ${escapeHtml(data.address)}</p>
    <p><strong>Rating 1:</strong> ${data.rating1}/10</p>
    <p><strong>Rating 2:</strong> ${data.rating2}/10</p>
    <p><strong>Rating 3:</strong> ${data.rating3}/10</p>
  `;
  
  resultsContainer.innerHTML = resultsHTML;
  resultsContainer.style.display = 'block';
  
  // Scroll to results
  resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Display average rating with color coding
 * @param {string} name - User's name
 * @param {string} surname - User's surname
 * @param {number} average - Average rating (0-10)
 */
function displayAverageRating(name, surname, average) {
  let averageContainer = document.getElementById('averageRating');
  
  // Create average rating container if it doesn't exist
  if (!averageContainer) {
    const resultsContainer = document.getElementById('formResults');
    averageContainer = document.createElement('div');
    averageContainer.id = 'averageRating';
    averageContainer.className = 'average-rating mt-3 p-3 rounded';
    resultsContainer.parentElement.insertAdjacentElement('afterend', averageContainer);
  }
  
  // Determine color based on average
  let color = '#dc3545'; // red (0-4)
  if (average > 4 && average <= 7) {
    color = '#ff8c00'; // orange (4-7)
  } else if (average > 7) {
    color = '#28a745'; // green (7-10)
  }
  
  // Display average with color
  const averageText = `${name} ${surname}: ${average.toFixed(1)}`;
  averageContainer.innerHTML = `<h5 style="color: ${color}; margin: 0;">${averageText}</h5>`;
  averageContainer.style.display = 'block';
}

/**
 * Show success popup notification
 */
function showSuccessPopup() {
  // Remove existing popup if present
  const existingPopup = document.getElementById('successPopup');
  if (existingPopup) {
    existingPopup.remove();
  }
  
  // Create popup element
  const popup = document.createElement('div');
  popup.id = 'successPopup';
  popup.className = 'success-popup';
  popup.innerHTML = `
    <div class="popup-content">
      <i class="bi bi-check-circle"></i>
      <p>Form submitted successfully!</p>
    </div>
  `;
  
  document.body.appendChild(popup);
  
  // Add animation class
  setTimeout(() => {
    popup.classList.add('show');
  }, 10);
  
  // Auto-remove after 4 seconds
  setTimeout(() => {
    popup.classList.remove('show');
    setTimeout(() => popup.remove(), 300);
  }, 4000);
}

/**
 * Show error alert
 * @param {string} message - Error message
 */
function showErrorAlert(message) {
  alert(message);
}

/**
 * Validate individual field
 * @param {Event} e - Input event
 */
function validateField(e) {
  const field = e.target;
  const fieldId = field.id;
  
  let isValid = true;
  let errorMessage = '';
  
  if (fieldId === 'formName' || fieldId === 'formSurname') {
    if (!field.value.trim()) {
      isValid = false;
      errorMessage = 'Letters only';
    } else if (!/^[a-zA-Z\s]+$/.test(field.value)) {
      isValid = false;
      errorMessage = 'Only letters allowed';
    }
  } else if (fieldId === 'formEmail') {
    if (!field.value.trim()) {
      isValid = false;
      errorMessage = 'Invalid email format';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      isValid = false;
      errorMessage = 'Invalid email format';
    }
  } else if (fieldId === 'formPhone') {
    // For phone, just check if it has enough digits (at least 11 after removing non-digits)
    const digitsOnly = field.value.replace(/\D/g, '');
    if (digitsOnly.length < 11) {
      isValid = false;
      errorMessage = 'Phone must have at least 11 digits (+370 format)';
    }
  } else if (fieldId === 'formAddress') {
    if (!field.value.trim() || field.value.trim().length < 5) {
      isValid = false;
      errorMessage = 'Address must be at least 5 characters';
    }
  }
  
  // Apply visual feedback (real-time validation)
  updateFieldValidation(field, isValid, errorMessage);
  
  // Update submit button state after a short delay to ensure DOM is updated
  setTimeout(() => updateSubmitButtonState(), 50);
}

/**
 * Update field validation styling
 * @param {HTMLElement} field - Input field element
 * @param {boolean} isValid - Field validity
 * @param {string} errorMessage - Error message
 */
function updateFieldValidation(field, isValid, errorMessage) {
  // Remove existing error message
  const existingError = field.parentElement.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
  
  if (!isValid) {
    field.classList.add('is-invalid');
    
    // Add error message below field
    const errorDiv = document.createElement('small');
    errorDiv.className = 'field-error text-danger d-block mt-1';
    errorDiv.textContent = errorMessage;
    field.parentElement.appendChild(errorDiv);
  } else {
    field.classList.remove('is-invalid');
  }
}

/**
 * Update submit button state based on form validity
 */
function updateSubmitButtonState() {
  const form = document.getElementById('contactForm');
  const submitButton = form.querySelector('button[type="submit"]');
  
  if (!submitButton) return;
  
  // Check if all required fields are valid
  const nameInput = document.getElementById('formName');
  const surnameInput = document.getElementById('formSurname');
  const emailInput = document.getElementById('formEmail');
  const phoneInput = document.getElementById('formPhone');
  const addressInput = document.getElementById('formAddress');
  
  // Check all fields are filled and without errors
  const isFormValid = 
    nameInput && nameInput.value.trim() && !nameInput.classList.contains('is-invalid') &&
    surnameInput && surnameInput.value.trim() && !surnameInput.classList.contains('is-invalid') &&
    emailInput && emailInput.value.trim() && !emailInput.classList.contains('is-invalid') &&
    phoneInput && phoneInput.value.trim() && !phoneInput.classList.contains('is-invalid') &&
    addressInput && addressInput.value.trim() && !addressInput.classList.contains('is-invalid');
  
  submitButton.disabled = !isFormValid;
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Format phone number as user types (Lithuanian format: +370 6xx xxxxx)
 * Allows only digits, automatically formats
 * @param {Event} e - Input event
 */
function formatPhoneNumber(e) {
  const input = e.target;
  let value = input.value.replace(/\D/g, ''); // Remove all non-digits
  
  // Limit to 12 digits (370 + 6 + 8 digits for Lithuanian format)
  if (value.length > 12) {
    value = value.slice(0, 12);
  }
  
  // Format based on length:
  // 370 = +370
  // 3706 = +370 6
  // 37061234 = +370 61 234
  // 370612345678 = +370 61 234 5678
  let formatted = '';
  
  if (value.length === 0) {
    formatted = '';
  } else if (value.length <= 3) {
    formatted = '+' + value;
  } else if (value.length <= 5) {
    formatted = '+' + value.slice(0, 3) + ' ' + value.slice(3);
  } else {
    formatted = '+' + value.slice(0, 3) + ' ' + value.slice(3, 5) + ' ' + value.slice(5);
  }
  
  input.value = formatted;
  
  // Log for debugging
  console.log('Phone formatted:', formatted);
}

/**
 * Handle special keys for phone input (prevent non-digit characters)
 * @param {Event} e - Keydown event
 */
function handlePhoneKeydown(e) {
  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
  const isDigit = /^\d$/.test(e.key);
  
  if (!isDigit && !allowedKeys.includes(e.key)) {
    e.preventDefault();
  }
}

/* ==================== LAB 12: Memory Game ==================== */

// Memory game data - at least 6 unique items
const GAME_ITEMS = [
  { id: 1, name: '🎨', label: 'Art' },
  { id: 2, name: '🎭', label: 'Theater' },
  { id: 3, name: '🎵', label: 'Music' },
  { id: 4, name: '📚', label: 'Books' },
  { id: 5, name: '⚽', label: 'Sports' },
  { id: 6, name: '🎮', label: 'Games' }
];

// Game configuration
const GAME_CONFIG = {
  easy: { rows: 3, cols: 4, name: 'Easy (3×4)' },
  hard: { rows: 4, cols: 6, name: 'Hard (4×6)' }
};

// Game state
let gameState = {
  difficulty: 'easy',
  cards: [],
  flipped: [],
  matched: [],
  moves: 0,
  matches: 0,
  gameActive: false,
  startTime: null,
  timerInterval: null
};

// Initialize memory game on page load
document.addEventListener('DOMContentLoaded', function() {
  initializeMemoryGame();
});

/**
 * Initialize memory game
 */
function initializeMemoryGame() {
  // Check if game section exists, create if needed
  let gameSection = document.getElementById('memoryGameSection');
  if (!gameSection) {
    createGameSection();
    gameSection = document.getElementById('memoryGameSection');
  }

  // Attach event listeners
  const difficultySelect = document.getElementById('difficultyLevel');
  if (difficultySelect) {
    difficultySelect.addEventListener('change', changeDifficulty);
  }

  const startBtn = document.getElementById('gameStartBtn');
  if (startBtn) {
    startBtn.addEventListener('click', startGame);
  }

  const restartBtn = document.getElementById('gameRestartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', restartGame);
  }

  // Initialize with easy difficulty
  initializeBoard();
}

/**
 * Create game section HTML
 */
function createGameSection() {
  const main = document.querySelector('main');
  if (!main) return;

  const gameHTML = `
    <section id="memoryGameSection" class="memory-game-section">
      <div class="container">
        <div class="section-title" data-aos="fade-up">
          <span class="subtitle">Game</span>
          <h2>Memory Game</h2>
        </div>

        <div class="game-container">
          <!-- Difficulty Selector -->
          <div class="game-controls">
            <label for="difficultyLevel">Difficulty Level:</label>
            <select id="difficultyLevel">
              <option value="easy">Easy (3×4 = 12 cards)</option>
              <option value="hard">Hard (4×6 = 24 cards)</option>
            </select>
          </div>

          <!-- Stats Panel -->
          <div class="stats-panel">
            <div class="stat-item">
              <span class="stat-label">Moves:</span>
              <span class="stat-value" id="movesCount">0</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Matches:</span>
              <span class="stat-value" id="matchesCount">0 / 6</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Time:</span>
              <span class="stat-value" id="timerDisplay">00:00</span>
            </div>
            <div class="stat-item best-score">
              <span class="stat-label">Best:</span>
              <span class="stat-value" id="bestScore">-</span>
            </div>
          </div>

          <!-- Game Board -->
          <div class="game-board" id="gameBoard"></div>

          <!-- Win Message -->
          <div class="win-message" id="winMessage" style="display: none;">
            <h3>🎉 You Won! 🎉</h3>
            <p id="winStats"></p>
          </div>

          <!-- Game Buttons -->
          <div class="game-buttons">
            <button id="gameStartBtn" class="btn btn-game">Start Game</button>
            <button id="gameRestartBtn" class="btn btn-game">Restart</button>
          </div>
        </div>
      </div>
    </section>
  `;

  main.insertAdjacentHTML('beforeend', gameHTML);
}

/**
 * Initialize game board
 */
function initializeBoard() {
  const config = GAME_CONFIG[gameState.difficulty];
  const totalCards = config.rows * config.cols;
  const pairsCount = totalCards / 2;

  // Create card array with pairs
  gameState.cards = [];
  for (let i = 0; i < pairsCount; i++) {
    const item = GAME_ITEMS[i % GAME_ITEMS.length];
    gameState.cards.push({ ...item, pairId: i });
    gameState.cards.push({ ...item, pairId: i });
  }

  // Shuffle cards
  gameState.cards = shuffleArray(gameState.cards);

  // Reset game state
  gameState.flipped = [];
  gameState.matched = [];
  gameState.moves = 0;
  gameState.matches = 0;
  gameState.gameActive = false;

  // Render board
  renderBoard();

  // Update stats
  updateStats();
  updateMatchesCount();
  displayBestScore();
}

/**
 * Render game board
 */
function renderBoard() {
  const board = document.getElementById('gameBoard');
  if (!board) return;

  board.innerHTML = '';
  const config = GAME_CONFIG[gameState.difficulty];
  board.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;

  gameState.cards.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.className = 'memory-card';
    cardElement.dataset.index = index;
    cardElement.dataset.pairId = card.pairId;
    cardElement.innerHTML = `
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back">${card.name}</div>
      </div>
    `;

    cardElement.addEventListener('click', () => flipCard(index));
    board.appendChild(cardElement);
  });
}

/**
 * Flip card
 */
function flipCard(index) {
  if (!gameState.gameActive) return;
  if (gameState.flipped.includes(index)) return;
  if (gameState.matched.includes(index)) return;

  const card = document.querySelector(`[data-index="${index}"]`);
  if (!card) return;

  gameState.flipped.push(index);
  card.classList.add('flipped');

  if (gameState.flipped.length === 2) {
    checkMatch();
  }
}

/**
 * Check if two flipped cards match
 */
function checkMatch() {
  const [index1, index2] = gameState.flipped;
  const card1 = gameState.cards[index1];
  const card2 = gameState.cards[index2];

  gameState.moves++;
  updateStats();

  if (card1.pairId === card2.pairId) {
    // Cards match
    gameState.matched.push(index1, index2);
    gameState.matches++;
    updateMatchesCount();

    gameState.flipped = [];

    // Check for win
    if (gameState.matches === gameState.cards.length / 2) {
      endGame();
    }
  } else {
    // Cards don't match - flip back
    setTimeout(() => {
      const card1El = document.querySelector(`[data-index="${index1}"]`);
      const card2El = document.querySelector(`[data-index="${index2}"]`);
      if (card1El) card1El.classList.remove('flipped');
      if (card2El) card2El.classList.remove('flipped');
      gameState.flipped = [];
    }, 1000);
  }
}

/**
 * Start game
 */
function startGame() {
  gameState.gameActive = true;
  gameState.startTime = Date.now();
  startTimer();

  const startBtn = document.getElementById('gameStartBtn');
  if (startBtn) startBtn.disabled = true;

  const winMessage = document.getElementById('winMessage');
  if (winMessage) winMessage.style.display = 'none';
}

/**
 * Restart game
 */
function restartGame() {
  stopTimer();
  initializeBoard();

  const startBtn = document.getElementById('gameStartBtn');
  if (startBtn) startBtn.disabled = false;

  const winMessage = document.getElementById('winMessage');
  if (winMessage) winMessage.style.display = 'none';
}

/**
 * End game (win)
 */
function endGame() {
  gameState.gameActive = false;
  stopTimer();

  const startBtn = document.getElementById('gameStartBtn');
  if (startBtn) startBtn.disabled = false;

  const elapsedTime = Math.floor((Date.now() - gameState.startTime) / 1000);

  // Check and save best score
  saveBestScore(gameState.moves);

  // Show win message
  const winMessage = document.getElementById('winMessage');
  const winStats = document.getElementById('winStats');
  if (winMessage && winStats) {
    winStats.textContent = `Completed in ${gameState.moves} moves and ${formatTime(elapsedTime)}!`;
    winMessage.style.display = 'block';
  }
}

/**
 * Update stats display
 */
function updateStats() {
  const movesCount = document.getElementById('movesCount');
  if (movesCount) movesCount.textContent = gameState.moves;
}

/**
 * Update matches count display
 */
function updateMatchesCount() {
  const matchesCount = document.getElementById('matchesCount');
  const totalPairs = gameState.cards.length / 2;
  if (matchesCount) matchesCount.textContent = `${gameState.matches} / ${totalPairs}`;
}

/**
 * Change difficulty
 */
function changeDifficulty(event) {
  gameState.difficulty = event.target.value;
  stopTimer();
  initializeBoard();

  const startBtn = document.getElementById('gameStartBtn');
  if (startBtn) startBtn.disabled = false;

  const winMessage = document.getElementById('winMessage');
  if (winMessage) winMessage.style.display = 'none';

  displayBestScore();
}

/**
 * Start timer
 */
function startTimer() {
  let seconds = 0;
  gameState.timerInterval = setInterval(() => {
    seconds++;
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
      timerDisplay.textContent = formatTime(seconds);
    }
  }, 1000);
}

/**
 * Stop timer
 */
function stopTimer() {
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
  }
}

/**
 * Format time (seconds to MM:SS)
 */
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Save best score to localStorage
 */
function saveBestScore(moves) {
  const key = `bestScore_${gameState.difficulty}`;
  const currentBest = localStorage.getItem(key);

  if (!currentBest || moves < parseInt(currentBest)) {
    localStorage.setItem(key, moves);
    displayBestScore();
  }
}

/**
 * Display best score from localStorage
 */
function displayBestScore() {
  const key = `bestScore_${gameState.difficulty}`;
  const bestScore = localStorage.getItem(key);
  const bestScoreEl = document.getElementById('bestScore');

  if (bestScoreEl) {
    bestScoreEl.textContent = bestScore ? `${bestScore} moves` : '-';
  }
}

/**
 * Shuffle array
 */
function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
