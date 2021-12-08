/* Initialize canvas size */
let canvasWidth = 1800;
let canvasHeight = 700;

/* Create a grid to store the nodes' data */
let graph = [];

/* Editing variables */
let selectedNodeType = 2; /* 0 = start 1 = end 2 = obstacle */
let lastStart = null; // Last node that was in start state
let lastEnd = null;   // Last node that was in end state
let started = false;

/* Algorithm variables */
let selectedAlgorithm = 0; // 0 = Dijkstra's | 1 = A* | 2 = BFS | 3 = DFS | 4 = Prim's | 5 = Greedy

/* Initialize square size */
let squareSize = 25;

/* Initialize columns and rows */
let cols = canvasWidth / squareSize;
let rows = canvasHeight / squareSize;

/* Initialize colors */
let idleColor = [0, 0, 0];
let hoverColor = [255, 255, 255];
let startColor = [33, 148, 255];
let endColor = [219, 0, 216];
let obstacleColor = [224, 224, 224];
let unvisitedColor = [255, 51, 68];
let visitedColor = [255, 145, 154];
let pathColor = [55, 166, 0];

/* Initialize node attributes */
class Node {
    constructor(col, row) {
        this.size = canvasWidth / cols;
        this.color = [0, 0, 0];
        this.assigned = false;
        this.state = 6; // 0 = start | 1 = end | 2 = obstacle | 3 = unvisited | 4 = visited | 5 = path | 6 = idle | 7 = hovered 

        this.x = col * this.size;
        this.y = row * this.size;

        this.neighbors = [];

        this.show = function () {
            noStroke();
            if (mouseX >= this.x && mouseX <= this.x + this.size && mouseY >= this.y && mouseY <= this.y + this.size) {
                if (!this.assigned) {
                    this.state = selectedNodeType;
                }
            } else {
                if (!this.assigned) {
                    this.state = 6;
                }
            }
            this.changeColor();
            rect(this.x, this.y, this.size, this.size, 10);
        };
    }

    changeColor() {
        switch (this.state) {
            case 0:
                this.color = startColor;
                break;
            case 1:
                this.color = endColor;
                break;
            case 2:
                this.color = obstacleColor;
                break;
            case 3:
                this.color = unvisitedColor;
                break;
            case 4:
                this.color = visitedColor;
                break;
            case 5:
                this.color = pathColor;
                break;
            case 6:
                this.color = idleColor;
                break;
            case 7:
                this.color = hoverColor;
                break;

        }
        fill(this.color);
    }
}

function createGraph() {
    for (let i = 0; i < cols; i++) {
        graph[i] = new Array()
        for (let j = 0; j < rows; j++) {
            graph[i][j] = new Node(i, j);
        }
    }
}

function showGraph() {
    for (let i = 0; i < graph.length; i++) {
        for (let j = 0; j < graph[i].length; j++) {
            graph[i][j].show();
        }
    }
}

function setup() {
    // Create canvas
    createCanvas(canvasWidth, canvasHeight);
    // Initialize graph
    createGraph();
}

function draw() {
    // Set background color
    background(0);
    // Display nodes in graph
    showGraph();
}

function chooseStart() {
    selectedNodeType = 0;
}

function chooseDestination() {
    selectedNodeType = 1;
}

function chooseObstacles() {
    selectedNodeType = 2;
}

function chooseEraser() {
    selectedNodeType = 6;
}

function chooseAlgorithm(algNum) {
    selectedAlgorithm = algNum;
    console.log(selectedAlgorithm);
    let newTitle = "";
    switch (selectedAlgorithm) {
        case 0:
            newTitle = "Dijkstra's Algorithm Visualizer"
            break;
        case 1:
            newTitle = "A* Algorithm Visualizer"
            break;
        case 2:
            newTitle = "BFS Algorithm Visualizer"
            break;
        case 3:
            newTitle = "DFS Algorithm Visualizer"
            break;
        case 4:
            newTitle = "Prim's Algorithm Visualizer"
            break;
        case 5:
            newTitle = "Greedy Algorithm Visualizer"
            break;
    }
    document.getElementById('titlename').textContent = newTitle;
}

function clearGraph() {
    if (!started) {
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                graph[i][j].state = 6;
                graph[i][j].assigned = false;
                graph[i][j].neighbors = [];
            }
        }
    }
}

function mousePressed() {
    if (!started) {
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (mouseX >= graph[i][j].x && mouseX <= graph[i][j].x + graph[i][j].size && mouseY >= graph[i][j].y && mouseY <= graph[i][j].y + graph[i][j].size) {
                    // Avoid duplicate start nodes
                    if (selectedNodeType == 0) {
                        if (lastStart != null) {
                            lastStart.state = 6;
                            lastStart.assigned = false;
                        }
                        lastStart = graph[i][j];
                        lastStart.state = selectedNodeType;
                        lastStart.assigned = true;
                        // Avoid duplicate end nodes
                    } else if (selectedNodeType == 1) {
                        if (lastEnd != null) {
                            lastEnd.state = 6;
                            lastEnd.assigned = false;
                        }
                        lastEnd = graph[i][j];
                        lastEnd.state = selectedNodeType;
                        lastEnd.assigned = true;
                        // Add obstacle node
                    } else {
                        graph[i][j].state = selectedNodeType;
                        if (selectedNodeType == 6) {
                            graph[i][j].assigned = false;
                        } else {
                            graph[i][j].assigned = true;
                        }
                    }
                }
            }
        }
    }
}

function mouseDragged() {
    if (!started) {
        if (selectedNodeType == 2 || selectedNodeType == 6) {
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    if (mouseX >= graph[i][j].x && mouseX <= graph[i][j].x + graph[i][j].size && mouseY >= graph[i][j].y && mouseY <= graph[i][j].y + graph[i][j].size) {
                        // Add obstacle nodes
                        graph[i][j].state = selectedNodeType;
                        if (selectedNodeType == 6) {
                            graph[i][j].assigned = false;
                        } else {
                            graph[i][j].assigned = true;
                        }
                    }
                }
            }
        }
    }
}
