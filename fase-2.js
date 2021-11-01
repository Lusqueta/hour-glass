const config = {
  minSize: 20,
  size: 21,
  wall: "#",
  sand: ".",
  empty: " ",
};

class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  equals(other) {
    return this.x == other.x && this.y == other.y;
  }

  static get left() {
    return new Vector2(-1, 0);
  }

  static get right() {
    return new Vector2(1, 0);
  }

  static get up() {
    return new Vector2(0, -1);
  }

  static get down() {
    return new Vector2(0, 1);
  }
}

function getLine(size, index) {
  const center = Math.floor(size / 2);
  let line = [];

  // Create top and bottom walls
  if (index === 0 || index === size - 1) {
    for (let i = 0; i < size; i++) {
      line.push(new Wall(new Vector2(i, index)));
    }
    return line;
  }

  // Add wall to start and end
  line.push(new Wall(new Vector2(0, index)));
  line.push(new Wall(new Vector2(size - 1, index)));

  // Calc spacing so that the center is not filled
  let spacing = 0;
  if (index === center) spacing = 1;
  else if (index === center - 1) spacing = 2;

  // Add inner walls
  line.push(new Wall(new Vector2(index + spacing, index)));
  line.push(new Wall(new Vector2(size - 1 - index - spacing, index)));

  // Fill with sand
  for (let i = index + 1; i < size - index - 1; i++) {
    line.push(new Sand(new Vector2(i, index)));
  }

  return line;
}

class GameObject {
  constructor(position, char) {
    this.position = position;
    this.char = char;
  }

  toString() {
    return this.char;
  }

  update(_game) {}
}

class Wall extends GameObject {
  constructor(position) {
    super(position, config.wall);
  }
}

class Sand extends GameObject {
  constructor(position) {
    super(position, config.sand);
  }

  getRelative(game, direction) {
    return game.getObject(this.position.add(direction));
  }

  update(game) {
    // Bottom
    if (!this.getRelative(game, Vector2.down)) {
      this.position.y += 1;
    }

    // Right bottom
    else if (
      !this.getRelative(game, Vector2.right.add(Vector2.down)) &&
      !(this.getRelative(game, Vector2.right) instanceof Wall)
    ) {
      this.position.x += 1;
      this.position.y += 1;
    }

    // Left bottom
    else if (
      !this.getRelative(game, Vector2.left.add(Vector2.down)) &&
      !(this.getRelative(game, Vector2.left) instanceof Wall)
    ) {
      this.position.x -= 1;
      this.position.y += 1;
    }

    // Right
    else if (!this.getRelative(game, Vector2.right)) {
      this.position.x += 1;
    }

    // Left
    else if (!this.getRelative(game, Vector2.left)) {
      this.position.x -= 1;
    }
  }
}

class Game {
  getObject(position) {
    return this.actors.find((actor) => actor.position.equals(position));
  }

  constructor(size) {
    this.size = size;
    this.actors = [];

    for (let i = 0; i < this.size; i++) {
      this.actors.push(...getLine(this.size, i));
    }
  }

  update() {
    this.actors.forEach((actor) => actor.update(this));
  }

  draw() {
    console.clear();

    for (let x = 0; x < this.size; x++) {
      let line = [];
      for (let y = 0; y < this.size; y++) {
        const found = this.getObject(new Vector2(y, x));
        if (found) {
          line.push(found.toString());
        } else {
          line.push(config.empty);
        }
      }
      console.log(x + 1 + "\t" + line.join(""));
    }
  }
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function getSize(argv) {
  const arg = argv[2];
  let size = config.size;

  if (arg && arg.startsWith("-")) {
    size = arg.split("n=")[1];
    if (size && isNumber(size)) {
      config.size = parseInt(size);
    }
  }

  return size;
}

function main(argv) {
  config.size = getSize(argv);
  if (config.size && config.size < config.minSize) {
    return console.log("Invalid size");
  }

  const game = new Game(config.size);
  const fps = 60;

  setInterval(() => {
    game.update();
    game.draw();
  }, 1000 / fps);
}

main(process.argv);
