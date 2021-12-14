/* Initialize canvas size */
let cnv;
let canvasWidth = 1900;
let canvasHeight = 969;

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
let selectedAlgorithm = null; // 0 = Dijkstra's | 1 = A* | 2 = BFS | 3 = DFS | 4 = Greedy
let currentNode = null; // Current node being explored
let queue = []; // BFS queue
let closedNodes = [];
let gScore = -Infinity;
let dScore = Infinity;
let finished = false;
let pathLine = undefined;

/* Initialize canvas elements' size*/
let desiredCols = 80;
let desiredRows = 29;
let squareSize = canvasWidth / desiredCols;
let cols = canvasWidth / squareSize;
let rows = desiredRows;

/* Initialize colors */
let idleColor = [0, 0, 0];
let hoverColor = [255, 255, 255];
let startColor = [0, 74, 179];
let endColor = [219, 0, 216];
let obstacleColor = [224, 224, 224];
let unvisitedColor = [0, 162, 255];
let visitedColor = [163, 217, 255];
let pathColor = [33, 144, 255];

/* Maze variables */
let randomObstacleProportion = 0.3;

/* Initialize node attributes */
class Node {
    constructor(col, row) {
        // Actual column and row numbers
        this.c = col;
        this.r = row;
        // Size, color and states
        this.size = squareSize;
        this.currSize = squareSize;
        this.color = [0, 0, 0];
        this.assigned = false;
        this.state = 6; // 0 = start | 1 = end | 2 = obstacle | 3 = unvisited | 4 = visited | 5 = path | 6 = idle | 7 = hovered 
        this.lastState = this.state;
        // Position in canvas
        this.x = col * this.size;
        this.y = row * this.size;
        // Algorithmic attributes
        this.parent = undefined;
        this.neighbors = [];
        // Heuristics
        // A* and Greedy BFS
        this.f = 0;
        this.g = 0;
        this.h = 0;
        // Dijkstra
        this.d = Infinity;
        // Display node in canvas
        this.show = function () {
            noStroke();
            // If mouse is hovering over the node
            if (mouseX >= this.x && mouseX <= this.x + this.size && mouseY >= this.y && mouseY <= this.y + this.size) {
                if (!started) {
                    // If node hasn't been assigned yet, set color to the selected node type's color
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
            // Change node's color according to it's state
            this.changeColor();
            // Grow node's size if necessary
            this.grow();
            // Display rectangle with current size
            rect(this.x, this.y, this.currSize, this.currSize, 10);
        };
        // Growth animation
        this.grow = function () {
            // If size is less than desired node size
            if (this.currSize < squareSize) {
                if (!this.assigned) {
                    this.currSize = this.currSize + 2.5;
                }
                this.currSize = this.currSize + 1.0;
            }
        }
        // Update neighbors when an algorith is about to be executed
        this.updateNeighbors = function () {
            // Cardinal
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
    // Change color attribute depending on the node's state
    changeColor() {
        // If state has been changed, set size to 0 to see growth animation
        if (this.lastState != this.state) {
            this.currSize = 0.0;
        }
        // Set last state to this state again
        this.lastState = this.state;
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

// Initialize canvas attributes and global values
function setup() {
    // Create canvas
    canvasWidth = windowWidth * 0.98;
    squareSize = canvasWidth / desiredCols;
    canvasHeight = squareSize * desiredRows;
    cnv = createCanvas(canvasWidth, canvasHeight);
    cnv.parent('visualizer');
    // Initialize graph
    createGraph();
    // Randomize start and end nodes
    randomizeMainPoints();
}

// Canvas' main loop
function draw() {
    // Set background color
    background(0);
    // Activate when started
    if (started) {
        if (selectedAlgorithm === 0) {
            run_dijsktra();
        } else if (selectedAlgorithm === 1) {
            run_astar();
        } else if (selectedAlgorithm === 2) {
            run_bfs();
        } else if (selectedAlgorithm === 3) {
            run_dfs();
        } else if (selectedAlgorithm === 4) {
            run_greedy();
        }
    }
    // Display nodes from graph
    showGraph();
    // Avoid showing path when canvas is cleared or is editable
    if (canShowPath) {
        drawPath();
    }
}

// Center the canvas according to the window's scale
function centerCanvas() {
    x = (windowWidth - width) / 2;
    y = 35; //(windowHeight - height) / 2;
    cnv.position(x, y);
}

// Change canvas' scale and nodes' sizes according to the window's scale
function setNewCanvasSize() {
    // Reset canvas size
    canvasWidth = windowWidth * 0.9375;
    squareSize = canvasWidth / desiredCols;
    canvasHeight = squareSize * desiredRows;
    resizeCanvas(canvasWidth, canvasHeight);
    // Create new graph with more elements
    cols = canvasWidth / squareSize;
    rows = desiredRows;
    createGraph();
    // Center canvas
    centerCanvas();
}

// Set a random position for the initial and the destination nodes
function randomizeMainPoints() {
    // Initialize random positions for start and end nodes
    randomStartX = randInt(0, cols);
    randomStartY = randInt(0, rows);
    randomEndX = randInt(0, cols);
    randomEndY = randInt(0, rows);
    // Draw start and end nodes
    currentStartNode = graph[randomStartX][randomStartY];
    currentEndNode = graph[randomEndX][randomEndY];
    graph[randomStartX][randomStartY].state = 0;
    graph[randomStartX][randomStartY].assigned = true;
    graph[randomEndX][randomEndY].state = 1;
    graph[randomEndX][randomEndY].assigned = true;
}

/* UI Functions */
// All of these change the node to be drawn in the canvas depending on the selection under the NavBar in the DOM
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

// Change the algorithm to be run depending on the selection under the Algorithms tab in the DOM
function chooseAlgorithm(algNum) {
    if (!started) {
        selectedAlgorithm = algNum;
    }
    let newTitle = "";
    let newSubtitle = "Select an algorithm.";
    switch (selectedAlgorithm) {
        case 0:
            newTitle = "Dijkstra's Algorithm Visualizer"
            newSubtitle = "Specially good to use when the destination's location is unknown, it uses the distance between each node to determine the best path to follow.";
            break;
        case 1:
            newTitle = "A* Algorithm Visualizer"
            newSubtitle = "Specially useful in complex paths, considers the distance between each node and the starting point, as well as the destination. Used when the destination's location is known.";
            break;
        case 2:
            newTitle = "BFS Algorithm Visualizer"
            newSubtitle = "Guarantees the shortest path, although it's better to use it only when the destination is close to the starting point since it evaluates almost every node in between.";
            break;
        case 3:
            newTitle = "DFS Algorithm Visualizer"
            newSubtitle = "DFS is better when the path is complex and there's most likely only one way out, assuming that the destination is far from the starting point.";
            break;
        case 4:
            newTitle = "Greedy Algorithm Visualizer"
            newSubtitle = "Greedy best-first search takes into account only the distance between each node and the destination, a little less optimal than A* in complex paths.";
            break;
        default:
            newTitle = document.getElementById('titlename').textContent;
            newSubtitle = document.getElementById('subtitle').textContent;
    }
    document.getElementById('titlename').textContent = newTitle;
    document.getElementById('subtitle').textContent = newSubtitle;
}

// Executed when the DOM's Start button is pressed
function start() {
    // If simulation hasn't been started yet
    if (!started) {
        // Both the start node and the end node must be already chosen
        if (currentStartNode != null && currentEndNode != null) {
            // Set finished to false
            started = true;
            finished = false;
            // Reset queue and closed set
            queue = [];
            closedNodes = [];
            // Start neighbors
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    graph[i][j].updateNeighbors();
                }
            }
            // Make initial algorithm operations
            canShowPath = true;
            if (selectedAlgorithm > 0 && selectedAlgorithm < 5) {
                // Initialize BFS, DFS, A* or Greedy BFS
                init_algorithm();
                loop();
            } else if (selectedAlgorithm == 0) {
                // Initialize Dijsktra's algorithm
                init_dijkstra();
            } else {
                canShowPath = false;
                started = false;
                alert("You need to choose an algorithm!")
            }
            starts++;
        } else {
            alert("You need a start node and a destination node!")
        }
    }
}

// Stop the algorithm's execution
function end() {
    // If algorithm has already been started
    if (started) {
        // End the algorithm
        started = false;
        // Let program receive input again
        loop();
    }
}

/* Graph manipulation functions */
// Get a random integer
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// Fill graph with nodes
function createGraph() {
    for (let i = 0; i < cols; i++) {
        graph[i] = new Array()
        for (let j = 0; j < rows; j++) {
            graph[i][j] = new Node(i, j);
        }
    }
}

// Display the graph's nodes
function showGraph() {
    for (let i = 0; i < graph.length; i++) {
        for (let j = 0; j < graph[i].length; j++) {
            graph[i][j].show();
        }
    }
}

// Set every node's state to idle except for obstacle, start and destination nodes
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
                    graph[i][j].f = 0;
                    graph[i][j].g = 0;
                    graph[i][j].h = 0;
                    graph[i][j].assigned = false;
                    graph[i][j].neighbors = [];
                }
            }
        }
    }
}

// Set every node's state to idle (no exceptions)
function clearGraph() {
    // Clear waypoints
    path = [];
    if (!started) {
        // Delete path visualization
        canShowPath = false;
        // Set all nodes as idle
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                graph[i][j].state = 6;
                graph[i][j].f = 0;
                graph[i][j].g = 0;
                graph[i][j].h = 0;
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

// Remove every obstacle from graph
function removeObstacles() {
    if (!started) {
        // Delete path
        canShowPath = false;
        // Reset queues and sets
        queue = [];
        closedNodes = [];
        // Set all obstacle nodes as idle
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (graph[i][j].state == 2) {
                    graph[i][j].state = 6;
                    graph[i][j].f = 0;
                    graph[i][j].g = 0;
                    graph[i][j].h = 0;
                    graph[i][j].assigned = false;
                    graph[i][j].neighbors = [];
                }
            }
        }
    }
}

function getDistance(n1, n2) {
    // Euclidean
    let x_distance = Math.pow(n2.c - n1.c, 2);
    let y_distance = Math.pow(n2.r - n1.r, 2);
    // Cartesian
    /* let x_distance = Math.abs(n1.c - n2.c);
    let y_distance = Math.abs(n1.r - n2.r); */
    return x_distance + y_distance;
}

function markState(node, state) {
    // Set node's state to this state
    if (node.state != 0 && node.state != 1) {
        node.state = state;
        node.assigned = true;
    }
}

/* Algorithm functions */
// Initialize Dijkstra's algorithm
function init_dijkstra() {
    // Reset lowestNode and score
    lowestNode = undefined;
    dScore = Infinity;
    // Set start node's d score to 0
    currentStartNode.d = 0;
    // Add every node from the graph to the queue
    for (let i = 0; i < graph.length; i++) {
        for (let j = 0; j < graph[i].length; j++) {
            if (graph[i][j] !== currentStartNode) {
                graph[i][j].d = Infinity;
            }
            queue.push(graph[i][j]);
        }
    }
}

// Run Dijkstra
function run_dijsktra() {
    // While the queue has elements
    if (queue.length > 0) {
        // Look for the node with the lowest d score
        let lowestNode = queue[0];
        for (node of queue) {
            if (node.d < lowestNode.d) {
                lowestNode = node;
            }
        }
        // Set lowest d score node as current node
        currentNode = lowestNode;
        console.log(currentNode);
        // If current d score is infinity, stop execution since there is no possible path to the next node
        if (currentNode.d === Infinity) {
            console.log("No solution.")
            started = false;
        }
        // Check if current node is already the destination
        if (currentNode === currentEndNode) {
            finished = true;
            queue = [];
            started = false;
            return;
        }
        // Remove current node from queue and add it to closed set
        let currentNodeIndex = queue.map(function (item) { return item; }).indexOf(currentNode);
        queue.splice(currentNodeIndex, 1);
        closedNodes.push(currentNode);
        // Set current node's state as visited
        markState(currentNode, 4);
        // Visit every neighbor from current node
        for (neighbor of currentNode.neighbors) {
            if (!closedNodes.includes(neighbor)) {
                // Mark neighbor as unvisited
                markState(neighbor, 3);
            }
            // Get d score from current node to neighbor
            dScore = currentNode.d + getDistance(neighbor, currentStartNode);
            // If this d score is lower than the neighbor's d score, set the neighbor's d score to the current d score
            if (dScore < neighbor.d) {
                neighbor.d = dScore;
                neighbor.parent = currentNode;
            }
        }
    }
}

// A*/BFS/DFS/Greedy queue/stack initialization
function init_algorithm() {
    // Add root node to queue
    queue.push(currentStartNode);
    // If the algorithm is DFS or BFS, add starting point to closed set
    if (selectedAlgorithm == 2 || selectedAlgorithm == 3) {
        closedNodes.push(currentStartNode);
    }
}

// A* execution
function run_astar() {
    // Execute while the queue is not empty
    if (queue.length > 0) {
        // Look for the lowest f-score node in the queue and set it as the current node
        let lowestNode = queue[0];
        for (node of queue) {
            if (node.f < lowestNode.f) {
                lowestNode = node;
            }
        }
        currentNode = lowestNode;
        // Check if current node is destination
        if (currentNode === currentEndNode) {
            finished = true;
            queue = [];
            started = false;
            return;
        }
        // Add current node to the closed set and remove it from queue
        closedNodes.push(currentNode);
        let currentNodeIndex = queue.map(function (item) { return item; }).indexOf(currentNode);
        queue.splice(currentNodeIndex, 1);
        // Set current node's state as visited
        markState(currentNode, 4);
        // For each valid node adjacent to the current node
        for (node of currentNode.neighbors) {
            // Ignore nodes that are already in the closed set
            if (closedNodes.includes(node)) {
                continue;
            }
            // Create temporary values
            let tempG = currentNode.g + getDistance(node, currentNode);
            // If there's a node in the open set, ignore it if it's g score is less than this score, since it's better already
            if (queue.includes(node)) {
                if (tempG > node.g) {
                    continue;
                }
            }
            // If none of these conditions are met, add neighbor to the queue
            node.g = tempG;
            node.h = getDistance(node, currentEndNode);
            node.f = node.g + node.h;
            node.parent = currentNode;
            queue.push(node);
            // Set current node's state as visited
            markState(node, 3);
        }
    } else {
        console.log("No solution.");
        started = false;
    }
}

// Execute BFS
function run_bfs() {
    if (queue.length > 0) {
        // Set current node
        currentNode = queue[0];
        // Add current node to closed nodes
        closedNodes.push(currentNode);
        // Change node's state to visited
        markState(currentNode, 4);
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
                markState(neighbor, 3);
            }
        }
        // Remove current node from queue
        queue.shift();
    } else {
        console.log("No solution.");
        started = false;
    }
}

// Execute DFS
function run_dfs() {
    // If queue's length is more than 0
    if (queue.length > 0) {
        // Get last element from queue
        currentNode = queue[queue.length - 1];
        closedNodes.push(currentNode);
        // Change node's state to visited
        markState(currentNode, 4);
        // Check if current node is destination
        if (currentNode == currentEndNode) {
            finished = true;
            queue = [];
            started = false;
            return;
        }
        // Remove last element
        let currentNodeIndex = queue.map(function (item) { return item; }).indexOf(currentNode);
        queue.splice(currentNodeIndex, 1);
        // Add neighbors to queue
        for (neighbor of currentNode.neighbors) {
            if (!closedNodes.includes(neighbor)) {
                queue.push(neighbor);
                closedNodes.push(neighbor);
                // Set node's state to unvisited
                markState(neighbor, 3);
                neighbor.parent = currentNode;
            }
        }
    } else {
        console.log("No solution.");
        started = false;
    }
}

function run_greedy() {
    // While there are still elements in queue
    if (queue.length > 0) {
        // Look for the node with the lowest distance to the goal
        let lowestNode = queue[0];
        for (node of queue) {
            if (node.h < lowestNode.h) {
                lowestNode = node;
            }
        }
        currentNode = lowestNode;
        // Set node state to visited
        markState(currentNode, 4);
        // Check if current node is the destination
        if (currentNode === currentEndNode) {
            finished = true;
            queue = [];
            started = false;
            return;
        }
        // Remove current node from queue and add it to closed set
        let currentNodeIndex = queue.map(function (item) { return item; }).indexOf(currentNode);
        queue.splice(currentNodeIndex, 1);
        closedNodes.push(currentNode);
        // Explore neighbors
        for (neighbor of currentNode.neighbors) {
            // Ignore nodes if they're already in the closed set or in the open set
            if (!closedNodes.includes(neighbor) && !queue.includes(neighbor)) {
                // Calculate h of the node and set it's parent to the current node
                neighbor.h = getDistance(neighbor, currentEndNode);
                neighbor.parent = currentNode;
                // Add node to queue
                queue.push(neighbor);
                // Mark node as unvisited
                markState(neighbor, 3);
            }
        }
    } else {
        console.log("No solution.");
        started = false;
    }
}

function drawPath() {
    // Appear only if finished
    if (finished) {
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

function windowResized() {
    setNewCanvasSize();
    randomizeMainPoints();
}

/* Maze generation */
function canBeObstacle() {
    let randomNumber = randInt(0, 10);
    let likeliness = Math.floor(randomObstacleProportion * 10);
    if (randomNumber < likeliness) {
        return true;
    } else {
        return false;
    }
}

function generateRandomMaze() {
    if (!started) {
        removeObstacles();
        let createObstacle = false;
        for (let i = 0; i < graph.length; i++) {
            for (let j = 0; j < graph[i].length; j++) {
                if (graph[i][j].state != 0 && graph[i][j].state != 1) {
                    createObstacle = canBeObstacle();
                    if (createObstacle) {
                        graph[i][j].state = 2;
                        graph[i][j].assigned = true;
                    }
                }
            }
        }
    }
}