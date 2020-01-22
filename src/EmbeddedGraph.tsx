import Graph from "./Graph";
import Vector from "./Vector";

function randomCoordinate() {
  return -10 + Math.random() * 20;
}

export default class EmbeddedGraph {
  graph: Graph;

  positions: { [index: number]: Vector };

  constructor(graph: Graph) {
    this.graph = graph;
    this.positions = {};
    for (let v of graph.vertices()) {
      this.positions[v] = new Vector(randomCoordinate(), randomCoordinate());
    }
  }

  vertices(): number[] {
    return this.graph.vertices();
  }
}
