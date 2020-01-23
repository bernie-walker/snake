const NUM_OF_COLS = 100;
const NUM_OF_ROWS = 60;

const GRID_ID = 'grid';

const getGrid = () => document.getElementById(GRID_ID);
const getCellId = (colId, rowId) => `c${colId}_${rowId}`;

const createCell = function(grid, colId, rowId) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.id = getCellId(colId, rowId);
  grid.appendChild(cell);
};

const getCell = (colId, rowId) =>
  document.getElementById(getCellId(colId, rowId));

const draw = function([colId, rowId], toDraw) {
  const cell = getCell(colId, rowId);
  cell.classList.add(toDraw);
};

const drawSnake = function(snakeBody, snakeType) {
  snakeBody.forEach(part => draw(part, snakeType));
};

const printScores = function(scores) {
  const scoreBoard = document.getElementById('scores');
  scoreBoard.innerText = scores;
};

const erase = function([colId, rowId], toErase) {
  const cell = getCell(colId, rowId);
  cell.classList.remove(toErase);
};

const drawBoard = function(game) {
  const [snakeBody, snakeType, snakeTail] = game.getSnakeSchematics();
  let [foodLocation, foodType] = game.getFoodSchematics();

  if (game.isFoodConsumed()) {
    game.generateFood();
    [foodLocation, foodType, prevFoodLocation] = game.getFoodSchematics();
    game.updateScore();
    erase(prevFoodLocation, foodType);
  } else {
    erase(snakeTail, snakeType);
  }

  drawSnake(snakeBody, snakeType);
  draw(foodLocation, foodType);
  printScores(game.scores);
};

const printGameSummary = function(scores) {
  document.querySelector('#board').classList.add('hide');
  document.querySelector('#game-summary').innerText = `Your Score: ${scores}`;
  document.querySelector('#finish-prompt').classList.remove('hide');
};

const startTheGame = function(game) {
  let interval;

  interval = setInterval(
    game => {
      game.progressGame();

      if (game.isOver()) {
        clearInterval(interval);
        printGameSummary(game.scores);
        return;
      }

      drawBoard(game);
    },
    150,
    game
  );
};

const createGrids = function() {
  const grid = getGrid();
  for (let y = 0; y < NUM_OF_ROWS; y++) {
    for (let x = 0; x < NUM_OF_COLS; x++) {
      createCell(grid, x, y);
    }
  }
};

const initBoard = function(game) {
  createGrids();
  drawBoard(game);
};

const handleKeyPress = game => {
  const actionLookupTable = {
    ArrowRight: 'goRight',
    ArrowLeft: 'goLeft',
    ArrowUp: 'goUp',
    ArrowDown: 'goDown'
  };
  game.navigateSnake(actionLookupTable[event.key]);
};

const attachEventListeners = game => {
  document.body.onkeydown = handleKeyPress.bind(null, game);
  document.querySelector('#continue-button').onclick = () =>
    window.location.reload();
};

const createNewGame = function() {
  const snake = new Snake(
    [
      [40, 25],
      [41, 25],
      [42, 25]
    ],
    new Direction(EAST),
    'snake'
  );

  const food = new Food([9, 9], 'regular');

  return new Game([NUM_OF_COLS, NUM_OF_ROWS], snake, food);
};

const main = function() {
  const game = createNewGame();

  attachEventListeners(game);

  initBoard(game);

  startTheGame(game);
};

window.onload = main;
