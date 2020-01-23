class Food {
  #position;
  #type;

  constructor(position, type) {
    this.#position = position;
    this.#type = type;
  }

  get location() {
    return this.#position;
  }

  get type() {
    return this.#type;
  }

  set location(newCoords) {
    this.#position = newCoords;
  }
}
