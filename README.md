# PathfindingVisualizer

## About
This repository was made by using native **HTML** and **CSS**, the server is run in **Flask**, and the project is being hosted by **Heroku**. You can find the visualizer here: https://joe-irigoyen-pathfinding.herokuapp.com/.

The algorithms that are included in this project as of ***December 2021*** are:

- **Dijkstra's Algorithm:** *This won't be as fast in the grid since every node is basically equally distant from each other, even though it uses Euclidean distances to make it look different from BFS. This algorithm is particularly good when there are different weights in the edges and the destination's location is unknown and the shortest path is needed.*
- **A* Algorithm:** *This algorithm is good for finding the shortest path to a known location. It makes twice the comparisons than other algorithms, but it can guarantee the shortesT path between the start and the destination in every case. It's better to use it when the path is complex and the heuristics are not underestimated/overestimated. Manhattan distance was used to estimate the distance between nodes.*
- **Breadth-First Search Algorithm:** *This is one of the basics. This algorithm looks up every child node before going to the next layer in the graph. This makes it explore more nodes than most of these algorithms, but it's quite good to use when the destination is close to the starting point and the path is quite simple. It guarantees the shortest path.*
- **Depth-First Search Algorithm:** *This algorithm is the least optimal when it comes to pathfinding, but it can be particularly fast when it comes to tight mazes, where te lanes are not that wide and there's basically only one way out. Does not guarantee the shortest path.*
- **Greedy Best First Search Algorithm:** *This algorithm is used when speed is of the essence. Uses only the distance to the goal as the measure to determine the best path to follow. Does not guarantee the shortest path, although it guarantees a pretty efficient path.*

# Preview
![Demo](https://media.giphy.com/media/Y3nx0RTIZWyXhWytI2/giphy-downsized-large.gif)
