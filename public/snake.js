const areCoordinatesEqual = (coordinate1, coordinate2) => {
  return coordinate1[0] === coordinate2[0] && coordinate1[1] === coordinate2[1];
};

class Snake {
  #positions;
  #direction;
  #type;
  #previousTail;

  constructor(positions, direction, type) {
    this.#positions = positions.slice();
    this.#direction = direction;
    this.#type = type;
    this.#previousTail = [0, 0];
  }

  get location() {
    return this.#positions.slice();
  }

  get species() {
    return this.#type;
  }

  get pastTail() {
    return this.#previousTail;
  }
  get head() {
    return this.#positions[this.#positions.length - 1];
  }

  isHeadAt(coordinates) {
    return areCoordinatesEqual(this.head, coordinates);
  }

  hasTouchedBody() {
    return this.#positions
      .slice(0, -1)
      .some(bodyParts => this.isHeadAt(bodyParts));
  }

  turn(action) {
    const directionLookupTable = {
      goRight: 'toRight',
      goLeft: 'toLeft',
      goUp: 'toUp',
      goDown: 'toDown'
    };
    this.#direction.change(directionLookupTable[action]);
  }

  move() {
    const [headX, headY] = this.#positions[this.#positions.length - 1];
    this.#previousTail = this.#positions.shift();

    const [deltaX, deltaY] = this.#direction.delta;

    this.#positions.push([headX + deltaX, headY + deltaY]);
  }

  retainTail() {
    this.#positions.unshift(this.#previousTail);
  }
}
