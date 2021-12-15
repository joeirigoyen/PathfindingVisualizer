from flask import *

app = Flask("Pathfinding Algorithms Visualizer")

@app.route('/')
def main():
    return render_template('index.html')