/* Initialize columns and rows */
let cols = 65;
let rows = 25;
/* Create a grid to  store the nodes' data */
let grid = new Array(cols);
/* Initialize square size */
let squareSize = 28;
let gridWidth = cols * squareSize;
let gridHeight = rows * squareSize;

class Node {
    constructor(i, j) {
        /* Positions */
        this.x = i;
        this.y = j;
        /* Set radius of square */
        this.r = squareSize;
        this.color = [212, 238, 255];
        /*Heuristics*/
        this.f = 0;
        this.g = 0;
        this.h = 0;
    }
}

function setup() {
    // Create canvas
    createCanvas(gridWidth, gridHeight);
    // Initialize grid
}

function draw() {
    background(255);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            noStroke();
            rect(x * squareSize, y * squareSize, squareSize, squareSize);
            if (x == 0 && y == 0) {
                fill(255, 8, 57);
            } else {
                fill(212, 238, 255);
            }
        }
    }
}