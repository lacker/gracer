import Graph from "./Graph";
import Vector from "./Vector";

function randomCoordinate() {
  return -10 + Math.random() * 20;
}

export default class EmbeddedGraph {
  graph: Graph;

  locations: { [index: number]: Vector };

  constructor(graph: Graph) {
    this.graph = graph;
    this.locations = {};
    for (let v of graph.vertices()) {
      this.locations[v] = new Vector(randomCoordinate(), randomCoordinate());
    }
  }
}
