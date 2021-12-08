var canvasSize = 600;
var resolution = 5;

var grid = [];
var rows = 0;
var nextRow = 0;
var canvas;

function setup() {
    canvas = createCanvas(canvasSize, canvasSize);
    canvas.parent('canvas');
    createGraph();
}

function draw() {
    background(51);
    showGraph();
}

function mouseDragged() { triggerMouse(); }
function mousePressed() { triggerMouse(); }

function triggerMouse() {
    if (mouseX <= width && mouseY <= height) {
        for (var i = 0; i < graph.length; i++) {
            if (mouseX >= graph[i].x && mouseX <= graph[i].x + graph[i].size) {
                if (mouseY >= graph[i].y && mouseY <= graph[i].y + graph[i].size) {
                    graph[i].trigger();
                }
            }
        }
    }
}

class Pixel {
    constructor() {
        this.size = canvasSize / resolution;
        this.color = 255;

        this.x = nextRow * this.size;
        this.y = rows * this.size;

        graph.push(this);

        if (graph.length % resolution == 0)
            rows++;

        nextRow++;
        if (nextRow == resolution)
            nextRow = 0;

        this.show = function () {
            stroke(0);
            strokeWeight(2);
            if (mouseX >= this.x && mouseX <= this.x + this.size) {
                if (mouseY >= this.y && mouseY <= this.y + this.size) {
                    fill(255, 255, 255);
                }
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
	for(var i = 0; i < graph.length; i++)
	{
		graph[i].show();
	}
}


function createGraph() {
    for (var i = 0; i < resolution * resolution; i++) {
        new Pixel();
    }
}