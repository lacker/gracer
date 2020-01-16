type Vertex = { x: number; y: number; edges: number[] };

function randomCoordinate() {
  return -10 + Math.random() * 20;
}

export default class Graph {
  constructor() {
    this.vertices = [];
  }

  addRandomVertex() {
    //
  }
}
