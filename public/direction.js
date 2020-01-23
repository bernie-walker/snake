const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;

class Direction {
  #heading;
  #deltas;
  #rotate;
  #changeDirection;

  constructor(initialHeading) {
    this.#heading = initialHeading;
    this.#deltas = {};
    this.#deltas[EAST] = [1, 0];
    this.#deltas[WEST] = [-1, 0];
    this.#deltas[NORTH] = [0, -1];
    this.#deltas[SOUTH] = [0, 1];

    this.#rotate = function(dir = 1) {
      if (dir == -1) {
        this.#heading += 4;
      }
      this.#heading = (this.#heading + dir) % 4;
    };

    this.#changeDirection = function(dirLookup) {
      const dir = dirLookup.get(this.#heading);

      if (!dir) return;

      this.#rotate(dir);
    };
  }

  get delta() {
    return this.#deltas[this.#heading];
  }

  change(key) {
    const actionReferenceLookup = {
      toRight: new Map([
        [NORTH, 1],
        [SOUTH, -1]
      ]),
      toLeft: new Map([
        [NORTH, -1],
        [SOUTH, 1]
      ]),
      toUp: new Map([
        [EAST, -1],
        [WEST, 1]
      ]),
      toDown: new Map([
        [EAST, 1],
        [WEST, -1]
      ])
    };

    const actionReference = actionReferenceLookup[key];

    if (!actionReference) return;

    this.#changeDirection(actionReference);
  }
}
