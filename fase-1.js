const config = {
  minSize: 20,
  size: 20,
  wall: "#",
  sand: ".",
  empty: " ",
};

function getLine(size, index) {
  const line = [];

  if (index === 0 || index === size - 1) {
    for (let _ = 0; _ < size; _++) {
      line.push(config.wall);
    }
    return line;
  }

  for (let _ = 0; _ < size; _++) {
    line.push(config.empty);
  }

  line[0] = config.wall;
  line[size - 1] = config.wall;

  line[index] = config.wall;
  line[size - index - 1] = config.wall;

  // Fill with sand
  for (let i = index + 1; i < size - index - 1; i++) {
    line[i] = config.sand;
  }

  return line;
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
  const hourGlass = [];

  config.size = getSize(argv);
  if (!config.size || config.size < config.minSize) {
    return console.log("Invalid size");
  }

  for (let i = 0; i < config.size; i++) {
    const line = getLine(config.size, i);
    hourGlass.push(line);
  }

  // Superior sand
  for (const line of hourGlass) {
    console.log(line.join(""));
  }

  // Inferior sand
  for (const line of hourGlass.reverse()) {
    console.log(line.join(""));
  }
}

main(process.argv);
