# Lab 12: Flip Card Memory Game

## Overview
Memory Game is a classic flip-card matching game implemented with vanilla JavaScript, HTML5, and CSS3. The game includes difficulty levels, move tracking, timer, and optional localStorage for storing best scores.

## Features Implemented

### Required Features (6 points)
✅ **Memory Game Section** - New section with id="memoryGameSection"
- Integrated into the website with proper styling
- Located before the footer in index.html

✅ **Difficulty Selector** - Easy and Hard modes
- Easy: 3×4 grid = 12 cards (6 pairs)
- Hard: 4×6 grid = 24 cards (12 pairs)
- Dropdown selector element with smooth transitions

✅ **Dynamic Card Generation** - Cards generated from data array
- 6 unique game items (emojis): 🎨, 🎭, 🎵, 📚, ⚽, 🎮
- Cards auto-generated based on difficulty level
- No hardcoded card HTML - all created dynamically

✅ **Card Flipping Logic**
- Click to flip cards
- Smooth 3D flip animation with CSS transforms
- Flip animation: `card-inner` with `rotateY(180deg)`
- Max 2 cards flipped at once

✅ **Matching Mechanism**
- Compare two flipped cards by `pairId`
- Matched cards stay revealed (add `.matched` class visual state)
- Unmatched cards auto-flip back after 1 second delay
- Prevents clicking during animation

✅ **Stats Tracking & Display**
- **Moves counter** - Incremented for each pair attempt
- **Matches counter** - Shows X / Total format
- **Timer** - Starts on "Start Game", displays MM:SS format
- Stats panel with 4-column grid layout

✅ **Win Condition & Message**
- Detects when all pairs are matched
- Displays popup message: "🎉 You Won! 🎉"
- Shows completion stats: "Completed in X moves and MM:SS!"
- Win message slides in with animation

✅ **Start & Restart Buttons**
- **Start Button**: Initializes game state, starts timer, disables button
- **Restart Button**: Clears game, reshuffles cards, resets stats
- Both buttons styled with golden gradient

✅ **CSS Styling & Responsive Design**
- Game container with glass-morphism effect (backdrop blur)
- Card styling with gradient backgrounds (purple and pink)
- Responsive grid layouts for all screen sizes
- Mobile optimization: Stacks elements vertically on small screens
- Accessibility: `@media (prefers-reduced-motion: reduce)` support

✅ **W3C Validation**
- All HTML valid (no errors or warnings)
- All CSS valid (no errors or warnings)
- No console JavaScript errors

### Optional Features (4 points)
✅ **localStorage for Best Scores**
- Stores best (lowest) move count per difficulty
- Keys: `bestScore_easy`, `bestScore_hard`
- Displays in stats panel: "Best: X moves"
- Updates after each win if new personal record achieved

✅ **Timer/Stopwatch**
- Starts on "Start Game" button click
- Displays in MM:SS format in stats panel
- Stops when game is won
- Resets when changing difficulty or restarting
- Updates every second with `setInterval`

## File Structure

### `assets/js/custom.js` - Lines 400-806
**Lab12 Game Logic:**
- `GAME_ITEMS` - Array of 6 game items with emoji/label
- `GAME_CONFIG` - Configuration for Easy (3×4) and Hard (4×6) modes
- `gameState` - Global game state object tracking all game data
- `initializeMemoryGame()` - Setup and event listener attachment
- `createGameSection()` - Dynamically creates entire game section HTML
- `initializeBoard()` - Creates and shuffles cards, renders board
- `renderBoard()` - Builds grid and card DOM elements
- `flipCard(index)` - Handles card click, flips card, checks for match
- `checkMatch()` - Validates if two cards match, updates stats
- `startGame()` - Initializes game state, starts timer
- `restartGame()` - Resets all state and reshuffles
- `endGame()` - Handles win condition, saves best score
- `updateStats()` / `updateMatchesCount()` - Update display values
- `changeDifficulty()` - Changes game difficulty and reinitializes
- `startTimer()` / `stopTimer()` - Timer management
- `formatTime(seconds)` - Formats seconds to MM:SS
- `saveBestScore()` / `displayBestScore()` - localStorage management
- `shuffleArray()` - Fisher-Yates shuffle algorithm

### `assets/css/custom.css` - Lines 740-1085
**Lab12 Styling:**
- `.memory-game-section` - Main section with gradient background
- `.game-container` - Central container with glass-morphism effect
- `.game-controls` - Difficulty selector styling
- `.stats-panel` - 4-column stats grid
- `.game-board` - CSS Grid for card layout
- `.memory-card` - Card container with perspective
- `.card-inner` / `.card-front` / `.card-back` - 3D flip animation
- `.win-message` - Victory popup styling
- `.btn-game` - Game button styling
- **Responsive breakpoints:**
  - Desktop: Full layout
  - Tablet (768px): 2-column stats, stack buttons
  - Mobile (480px): 2-column stats, reduced font sizes
- **Accessibility:** `@media (prefers-reduced-motion: reduce)` disables animations

### `index.html` - Multiple Changes
1. **Navigation** - Added "Memory Game" link pointing to `#memoryGameSection`
2. **HTML Structure** - Added comment placeholder (section created dynamically by JS)
3. **Integration** - Game section inserted before `</main>` tag

## How It Works

### Game Flow
1. Page loads → `DOMContentLoaded` fires → `initializeMemoryGame()`
2. JavaScript creates game section HTML dynamically
3. User selects difficulty (Easy/Hard)
4. User clicks "Start Game" button
5. Timer starts, game becomes interactive
6. User clicks cards to flip them
7. On each pair flip:
   - Compare `pairId` of both cards
   - If match → cards stay revealed, matches count increases
   - If no match → cards flip back after 1 second, moves count increases
8. Game ends when all pairs matched
9. Win message displays with stats
10. Best score saved to localStorage
11. User can restart or change difficulty

### Card Flipping Animation
```css
.card-inner {
  transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform-style: preserve-3d;
}

.memory-card.flipped .card-inner {
  transform: rotateY(180deg);
}
```
- 3D perspective effect with `preserve-3d`
- Smooth easing curve for natural flip motion
- Front shows "?", back shows emoji

### Data Structure
```javascript
const GAME_ITEMS = [
  { id: 1, name: '🎨', label: 'Art' },
  // ... 6 items total
];

gameState = {
  difficulty: 'easy',
  cards: [],           // Array of card objects
  flipped: [],         // Indices of currently flipped cards (max 2)
  matched: [],         // Indices of matched card pairs
  moves: 0,            // Move counter
  matches: 0,          // Matched pairs counter
  gameActive: false,   // Is game in play?
  startTime: null,     // Game start timestamp
  timerInterval: null  // Timer interval ID
};
```

## Testing Checklist

- ✅ Page loads without errors
- ✅ Game section displays with proper styling
- ✅ Easy mode: 3×4 grid with 12 cards (6 unique + 6 pairs)
- ✅ Hard mode: 4×6 grid with 24 cards (12 unique + 12 pairs)
- ✅ Cards flip on click with animation
- ✅ Cannot flip more than 2 cards at once
- ✅ Matched cards stay revealed
- ✅ Unmatched cards flip back after 1 second
- ✅ Moves counter increments after each pair attempt
- ✅ Matches counter shows X / Total format
- ✅ Timer starts on "Start Game" and counts up
- ✅ Win message shows when all pairs matched
- ✅ Win stats display moves and time
- ✅ Best score saves to localStorage
- ✅ Best score displays in stats panel
- ✅ Restart button resets all state
- ✅ Changing difficulty reinitializes game
- ✅ Responsive design on mobile (< 768px)
- ✅ Animations disabled for `prefers-reduced-motion`
- ✅ W3C HTML validation passes
- ✅ W3C CSS validation passes

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires: CSS3 Transforms, localStorage API, ES6 JavaScript
- Fallback: Basic game works without localStorage (best score won't save)

## Optional Enhancements
- Sound effects on card flip/match
- Difficulty levels with time limits
- Global high score leaderboard
- Keyboard controls (arrow keys to select, Enter to flip)
- Animation themes

---

**Lab12 Status:** ✅ **COMPLETE**
- All 6 required features implemented
- Both 4 optional features implemented
- All files validated
- Ready for grading
