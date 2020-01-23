class Game {
  #snake;
  #food;
  #height;
  #breadth;
  #prevFood;
  #points;

  constructor([breadth, height], snake, food) {
    this.#snake = snake;
    this.#breadth = breadth;
    this.#height = height;
    this.#food = food;
    this.#prevFood = [];
    this.#points = 0;
  }

  get prevFoodLocation() {
    return this.#prevFood;
  }

  get scores() {
    return this.#points;
  }

  getFoodSchematics() {
    return [this.#food.location, this.#food.type, this.#prevFood];
  }

  getSnakeSchematics() {
    return [this.#snake.location, this.#snake.species, this.#snake.pastTail];
  }

  isFoodConsumed() {
    return this.#snake.isHeadAt(this.#food.location);
  }

  navigateSnake(action) {
    this.#snake.turn(action);
  }

  progressGame() {
    this.#snake.move();
    if (this.isFoodConsumed()) {
      this.#snake.retainTail();
    }
  }

  isOver() {
    return (
      this.#snake.hasTouchedBody() ||
      this.#snake.head[0] < 0 ||
      this.#snake.head[0] >= this.#breadth ||
      this.#snake.head[1] < 0 ||
      this.#snake.head[1] >= this.#height
    );
  }

  generateFood() {
    this.#prevFood = this.#food.location;
    const column = Math.floor(Math.random() * this.#breadth);
    const row = Math.floor(Math.random() * this.#height);
    this.#food.location = [column, row];
  }

  updateScore() {
    this.#points += 3;
  }
}
