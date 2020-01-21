import Graph from "./Graph";

type Vector = { x: number; y: number };

// An embedding maps a graph into Cartesian space so that it can be displayed.
export default class Embedding {
  graph: Graph;

  constructor(graph: Graph) {
    this.graph = graph;
  }

  step(): void {
    this.graph.step();
  }

  vertices(): Vector[] {
    let answer = [];
    for (let v of this.graph.getVertices()) {
      answer.push({ x: v.x, y: v.y });
    }
    return answer;
  }

  // Returns a list of [vertex1, vertex2] edges
  edges(): Vector[][] {
    return this.graph.edges();
  }
}
