type Vertex = { x: number; y: number; edges: number[] };

function randomCoordinate() {
  return -10 + Math.random() * 20;
}

export default class Graph {
  constructor() {
    this.vertices = [];
  }

  hasEdge(i: number, j: number): boolean {
    let v = this.vertices[i];
    if (!v) {
      return false;
    }
    for (let out of v.edges) {
      if (out === j) {
        return true;
      }
    }
    return false;
  }

  chooseVertex(): number {
    return Math.floor(this.vertices.length * Math.random());
  }

  addRandomVertex() {
    this.vertices.push({
      x: randomCoordinate(),
      y: randomCoordinate(),
      edges: []
    });
  }

  isEmpty(): boolean {
    return this.vertices.length === 0;
  }

  addRandomEdge() {
    if (this.vertices.length < 2) {
      return;
    }

    for (let count = 0; count < 1000; count++) {
      let i = this.chooseVertex();
      let j = this.chooseVertex();
      if (i === j || this.hasEdge(i, j)) {
        continue;
      }
      this.vertices[i].edges.push(j);
      this.vertices[j].edges.push(i);
      return;
    }

    throw new Error("graph is overedged");
  }
}
