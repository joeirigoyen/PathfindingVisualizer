/* Initialize canvas size */
let canvasWidth = 1800;
let canvasHeight = 700;
/* Create a grid to store the nodes' data */
let graph = [];

/* Initialize square size */
let squareSize = 25;

/* Initialize columns and rows */
let cols = canvasWidth / squareSize;
let rows = canvasHeight / squareSize;

function setup() {
    // Create canvas
    createCanvas(canvasWidth, canvasHeight);
    // Initialize grid
    createGraph();
}

function draw() {
    background(255);
    showGraph();
}

class Node {
    constructor(col, row) {
        this.size = canvasWidth / cols;
        this.color = 255;

        this.x = col * this.size;
        this.y = row * this.size;

        this.show = function () {
            noStroke();
            strokeWeight(2);
            if (mouseX >= this.x && mouseX <= this.x + this.size && mouseY >= this.y && mouseY <= this.y + this.size) {
                fill(255, 255, 255);
            } else {
                fill(0, 0, 0);
            }
            rect(this.x, this.y, this.size, this.size);
        };

        this.trigger = function () {
            console.log('A pixel was triggered');
        };
    }
}

function showGraph() {
    for (let i = 0; i < graph.length; i++) {
        for (let j = 0; j < graph[i].length; j++) {
            graph[i][j].show();
        }
    }
}

function createGraph() {
	for(let i = 0; i < cols; i++) {
        graph[i] = new Array()
        for (let j = 0; j < rows; j++) {
            graph[i][j] = new Node(i, j);
        }
	}
}