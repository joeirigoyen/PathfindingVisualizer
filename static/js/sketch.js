/* Initialize canvas size */
let canvasWidth = 1800;
let canvasHeight = 700;

/* Create a grid to store the nodes' data */
let graph = [];
let starts = 0;

/* Editing variables */
let randomStartX, randomStartY, randomEndX, randomEndY;
let selectedNodeType = 2; /* 0 = start 1 = end 2 = obstacle */
let currentStartNode = null; // Last node that was in start state
let currentEndNode = null;   // Last node that was in end state
let started = false;
let canShowPath = false;

/* Algorithm variables */
let path = [] // Path followed by the algorithm
let selectedAlgorithm = null; // 0 = Dijkstra's | 1 = A* | 2 = BFS | 3 = DFS | 4 = Prim's | 5 = Greedy
let currentNode = null; // Current node being explored
let queue = []; // BFS queue
let closedNodes = [];
let finished = false;
let pathLine = undefined;

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
        this.c = col;
        this.r = row;
        this.size = canvasWidth / cols;
        this.color = [0, 0, 0];
        this.assigned = false;
        this.state = 6; // 0 = start | 1 = end | 2 = obstacle | 3 = unvisited | 4 = visited | 5 = path | 6 = idle | 7 = hovered 

        this.x = col * this.size;
        this.y = row * this.size;

        this.parent = undefined;
        this.neighbors = [];

        this.show = function () {
            noStroke();
            if (mouseX >= this.x && mouseX <= this.x + this.size && mouseY >= this.y && mouseY <= this.y + this.size) {
                if (!started) {
                    if (!this.assigned) {
                        this.state = selectedNodeType;
                    }
                }
            } else {
                if (!started) {
                    if (!this.assigned) {
                        this.state = 6;
                    }
                }
            }
            this.changeColor();
            rect(this.x, this.y, this.size, this.size, 10);
        };

        this.updateNeighbors = function () {
            // Left neighbor
            if (this.c > 0) {
                let node = graph[this.c - 1][this.r];
                if (node.state != 2) {
                    this.neighbors.push(node);
                }
            }
            // Right neighbor
            if (this.c < cols - 1) {
                let node = graph[this.c + 1][this.r];
                if (node.state != 2) {
                    this.neighbors.push(node);
                }
            }
            // Upper neighbor
            if (this.r > 0) {
                let node = graph[this.c][this.r - 1];
                if (node.state != 2) {
                    this.neighbors.push(node);
                }
            }
            // Lower neighbor
            if (this.r < rows - 1) {
                let node = graph[this.c][this.r + 1];
                if (node.state != 2) {
                    this.neighbors.push(node);
                }
            }
        }
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

function setup() {
    // Create canvas
    createCanvas(canvasWidth, canvasHeight);
    // Initialize random positions for start and end nodes
    randomStartX = randInt(0, cols);
    randomStartY = randInt(0, rows);
    randomEndX = randInt(0, cols);
    randomEndY = randInt(0, rows);
    // Initialize graph
    createGraph();
    // Draw start and end nodes
    currentStartNode = graph[randomStartX][randomStartY];
    currentEndNode = graph[randomEndX][randomEndY];
    graph[randomStartX][randomStartY].state = 0;
    graph[randomStartX][randomStartY].assigned = true;
    graph[randomEndX][randomEndY].state = 1;
    graph[randomEndX][randomEndY].assigned = true;
}

function draw() {
    // Set background color
    background(0);
    // Activate when started
    if (started) {
        if (selectedAlgorithm == 2) {
            run_bfs();
        } else if (selectedAlgorithm == 3) {
            run_dfs();
        }
    }
    // Display nodes from graph
    showGraph();
    if (canShowPath) {
        drawPath();
    }
}

/* UI Functions */
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
        default:
            newTitle = document.getElementById('titlename').textContent;
    }
    document.getElementById('titlename').textContent = newTitle;
}

function start() {
    // If simulation hasn't started
    if (!started) {

        // Both the start node and the end node must be already chosen
        if (currentStartNode != null && currentEndNode != null) {
            // Set finished to false
            started = true;
            finished = false;
            // Start neighbors
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    graph[i][j].updateNeighbors();
                }
            }
            // Make initial algorithm operations
            canShowPath = true;
            switch (selectedAlgorithm) {
                case 0:
                    break;
                case 1:
                    break;
                case 2: // BFS
                    init_bfs();
                    loop();
                    break;
                case 3:
                    init_bfs();
                    loop();
                    break;
                case 4:
                    break;
                case 5:
                    break;
                default:
                    alert("You need to choose an algorithm!")
                    canShowPath = false;
                    started = false;
                    return;
            }
            starts++;
        } else {
            alert("You need a start node and a destination node!")
        }
    }
}


function end() {
    // If algorithm has already started
    if (started) {
        // End the algorithm
        started = false;
        // Let program receive input again
        loop();
    }
}

/* Graph manipulation functions */
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
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

function restartGraph() {
    if (!started) {
        // Delete path
        canShowPath = false;
        // Reset queues and sets
        queue = [];
        closedNodes = [];
        // Set all nodes as idle
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (graph[i][j].state != 0 && graph[i][j].state != 1 && graph[i][j].state != 2) {
                    graph[i][j].state = 6;
                    graph[i][j].assigned = false;
                    graph[i][j].neighbors = [];
                }
            }
        }
    }
}

function clearGraph() {
    path = [];
    if (!started) {
        // Delete path
        canShowPath = false;
        // Set all nodes as idle
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                graph[i][j].state = 6;
                graph[i][j].assigned = false;
                graph[i][j].neighbors = [];
            }
        }
        // Reset queues and sets
        queue = [];
        closedNodes = [];
        // Unassign start and end nodes
        currentStartNode = null;
        currentEndNode = null;
        clear();
    }
}

/* Algorithm functions */
// BFS

function init_bfs() {
    // Empty the queue before using it
    queue = [];
    // Add root node to queue
    queue.push(currentStartNode);
}

function run_bfs() {
    if (queue.length > 0) {
        // Set current node
        currentNode = queue[0];
        // Add current node to closed nodes
        closedNodes.push(currentNode);
        // Change node's state to visited
        if (currentNode.state != 0 && currentNode.state != 1) {
            currentNode.state = 4;
            currentNode.assigned = true;
        }
        // If current node is the destination, end search
        if (currentNode == currentEndNode) {
            finished = true;
            queue = [];
            started = false;
            return;
        }
        // Else, add valid neighbors to queue
        for (neighbor of currentNode.neighbors) {
            // If a neighbor is not in closed set
            if (!closedNodes.includes(neighbor)) {
                // Add neighbor to queue
                queue.push(neighbor);
                // Add neighbor to closed set
                closedNodes.push(neighbor);
                // Set node's parent
                neighbor.parent = currentNode;
                // Set node's state to unvisited
                if (neighbor.state != 0 && neighbor.state != 1) {
                    neighbor.state = 3;
                    neighbor.assigned = true;
                }
            }
        }
        // Remove current node from queue
        queue.shift();
    } else {
        console.log("No solution.");
        started = false;
    }
}

function run_dfs() {
    // If queue's length is more than 0
    if (queue.length > 0) {
        // Get last element from queue
        currentNode = queue[queue.length - 1];
        closedNodes.push(currentNode);
        // Change node's state to visited
        if (currentNode.state != 0 && currentNode.state != 1) {
            currentNode.state = 4;
            currentNode.assigned = true;
        }
        // Check if current node is destination
        if (currentNode == currentEndNode) {
            finished = true;
            queue = [];
            started = false;
            return;
        }
        // Remove last element
        let currentNodeIndex = queue.map(function (item) {return item;}).indexOf(currentNode);
        queue.splice(currentNodeIndex, 1);
        // Add neighbors to queue
        for (neighbor of currentNode.neighbors) {
            if (!closedNodes.includes(neighbor)) {
                queue.push(neighbor);
                closedNodes.push(neighbor);
                // Set node's state to unvisited
                if (neighbor.state != 0 && neighbor.state != 1) {
                    neighbor.state = 3;
                    neighbor.assigned = true;
                }
                neighbor.parent = currentNode;
            }
        }
    } else {
        console.log("No solution.");
        started = false;
    }
}


function drawPath() {
    // Empty path
    path = [];
    // Only check nodes after first start
    if (starts > 0) {
        // Temporary value to store current node and it's parents
        let temp = currentNode;
        path.push(temp);
        // While there are still parents
        while (true) {
            if (temp.parent === undefined) {
                break;
            } else {
                // Add parents to path
                path.push(temp.parent);
                temp = temp.parent;
            }
        }
    }
    // After adding cells to path, draw line between nodes
    if (path.length > 0) {
        noFill();
        stroke(pathColor);
        strokeWeight(8);
        beginShape();
        for (node of path) {
            vertex(node.x + node.size / 2, node.y + node.size / 2);
        }
        endShape();
    }
}

/* Events */

function mousePressed() {
    if (!started) {
        // Clean graph except for start, end and obstacle nodes
        if (starts > 0) {
            restartGraph();
        }
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (mouseX >= graph[i][j].x && mouseX <= graph[i][j].x + graph[i][j].size && mouseY >= graph[i][j].y && mouseY <= graph[i][j].y + graph[i][j].size) {
                    // Avoid duplicate start nodes
                    if (selectedNodeType == 0) {
                        if (currentStartNode != null) {
                            currentStartNode.state = 6;
                            currentStartNode.assigned = false;
                        }
                        currentStartNode = graph[i][j];
                        currentStartNode.state = selectedNodeType;
                        currentStartNode.assigned = true;
                        // Avoid duplicate end nodes
                    } else if (selectedNodeType == 1) {
                        if (currentEndNode != null) {
                            currentEndNode.state = 6;
                            currentEndNode.assigned = false;
                        }
                        currentEndNode = graph[i][j];
                        currentEndNode.state = selectedNodeType;
                        currentEndNode.assigned = true;
                        // Add obstacle node
                    } else {
                        // Check if one of the cells is a start node or an end node
                        if (graph[i][j].state == 0) {
                            currentStartNode = null;
                        } else if (graph[i][j].state == 1) {
                            currentEndNode = null;
                        }
                        // Add / remove the node's assigned state depending on the current selection
                        if (selectedNodeType == 6) {
                            graph[i][j].assigned = false;
                        } else {
                            graph[i][j].assigned = true;
                        }
                        graph[i][j].state = selectedNodeType;
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
                        // Check if one of the cells is a start node or an end node
                        if (graph[i][j].state == 0) {
                            currentStartNode = null;
                        } else if (graph[i][j].state == 1) {
                            currentEndNode = null;
                        }
                        // Add obstacle/empty nodes
                        if (selectedNodeType == 6) {
                            graph[i][j].assigned = false;
                        } else {
                            graph[i][j].assigned = true;
                        }
                        graph[i][j].state = selectedNodeType;
                    }
                }
            }
        }
    }
}
