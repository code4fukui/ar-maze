export class Maze {
  constructor(columns, rows, makeflg = true) {
    this.columns = columns;
    this.rows = rows;
    this.grid = [];
    this.stack = [];
    this.currentCell = null;
    this.setup();
    if (makeflg) this.make();
  }
  setup() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        this.grid.push(new Cell(x, y));
      }
    }
    this.currentCell = this.grid[0];
    this.currentCell.visited = true;
    this.stack.push(this.currentCell);
  }
  makeStep() {
    this.currentCell.visited = true;
    const nextCell = this.currentCell.checkNeighbours(this.grid, this.columns, this.rows);
    if (nextCell) {
      nextCell.visited = true;
      this.stack.push(this.currentCell);
      this.removeWalls(this.currentCell, nextCell);
      this.currentCell = nextCell;
    } else if (this.stack.length > 0) {
      this.currentCell = this.stack.pop();
    }
    if (this.stack.length > 0) {
      return true; // continue
    }
    this.grid[0].walls.left = false; // start
    this.grid[this.grid.length - 1].walls.right = false; // goal
    return false;
  };
  make() {
    while (this.makeStep());
  }
  removeWalls(current, next) {
    const x = current.x - next.x;
    if (x === 1) {
      current.walls.left = false;
      next.walls.right = false;
    } else if (x === -1) {
      current.walls.right = false;
      next.walls.left = false;
    }
    const y = current.y - next.y;
    if (y === 1) {
      current.walls.top = false;
      next.walls.bottom = false;
    } else if (y === -1) {
      current.walls.bottom = false;
      next.walls.top = false;
    }
  }
  drawCanvas(g, cellSize) {
    g.save();
    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
    g.translate(10, 10);
    this.grid.forEach(cell => cell.drawCanvas(g, cellSize));
    g.restore();
  }
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.walls = {
      top: true,
      right: true,
      bottom: true,
      left: true,
    };
    this.visited = false;
  }
  checkNeighbours(grid, columns, rows) {
    const neighbours = [];
    const top = grid[this.index(this.x, this.y - 1, columns, rows)];
    const right = grid[this.index(this.x + 1, this.y, columns, rows)];
    const bottom = grid[this.index(this.x, this.y + 1, columns, rows)];
    const left = grid[this.index(this.x - 1, this.y, columns, rows)];

    if (top && !top.visited) neighbours.push(top);
    if (right && !right.visited) neighbours.push(right);
    if (bottom && !bottom.visited) neighbours.push(bottom);
    if (left && !left.visited) neighbours.push(left);

    if (neighbours.length > 0) {
      const random = Math.floor(Math.random() * neighbours.length);
      return neighbours[random];
    }
    return undefined;
  }
  index(x, y, columns, rows) {
    if (x < 0 || y < 0 || x > columns - 1 || y > rows - 1) {
      return -1;
    }
    return x + y * columns;
  }
  drawCanvas(context, cellSize) {
    const x = this.x * cellSize;
    const y = this.y * cellSize;
    context.strokeStyle = '#000';
    const lw = cellSize / 4;
    context.lineWidth = lw;
    const lw2 = lw / 2;

    if (this.walls.top) {
      context.beginPath();
      context.moveTo(x - lw2, y);
      context.lineTo(x + cellSize + lw2, y);
      context.stroke();
    }
    if (this.walls.right) {
      context.beginPath();
      context.moveTo(x + cellSize, y - lw2);
      context.lineTo(x + cellSize, y + cellSize + lw2);
      context.stroke();
    }
    if (this.walls.bottom) {
      context.beginPath();
      context.moveTo(x - lw2, y + cellSize);
      context.lineTo(x + cellSize + lw2, y + cellSize);
      context.stroke();
    }
    if (this.walls.left) {
      context.beginPath();
      context.moveTo(x, y - lw2);
      context.lineTo(x, y + cellSize + lw2);
      context.stroke();
    }
  }
}
