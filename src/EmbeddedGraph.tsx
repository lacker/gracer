import Graph from "./Graph";
import Vector from "./Vector";

function randomCoordinate() {
  return -10 + Math.random() * 20;
}

export default class EmbeddedGraph {
  graph: Graph;

  positions: Map<number, Vector>;

  constructor(graph: Graph) {
    this.graph = graph;
    this.positions = new Map();
    for (let v of graph.vertices()) {
      this.positions.set(v, new Vector(randomCoordinate(), randomCoordinate()));
    }
  }

  position(v: number): Vector {
    let answer = this.positions.get(v);
    if (!answer) {
      throw new Error(`no position for vertex ${v}`);
    }
    return answer;
  }

  vertices(): number[] {
    return this.graph.vertices();
  }

  edges(): number[][] {
    return this.graph.edges();
  }

  step(): void {
    // Update positions in a batch at the end
    let newPositions = new Map<number, Vector>();

    for (let vertex of this.vertices()) {
      let vpos = this.position(vertex);
      let force = Vector.zero();
      for (let neighbor of this.graph.neighbors(vertex)) {
        let npos = this.position(neighbor);

        // Figure out the target spot where we should be
        let diff = vpos.sub(npos);
        let idealDiff = diff.scaleTo(1);
        let target = npos.add(idealDiff);

        // Scale quadratically like a real spring
        let delta = target.sub(vpos);
        let partialForce = delta.scale(0.5 * delta.length());
        force = force.add(partialForce);
      }

      // Cap the force
      let cap = 0.5;
      if (force.length() > cap) {
        force = force.scaleTo(cap);
      }
      if (force.length() < 0.001) {
        continue;
      }
      newPositions.set(vertex, vpos.add(force));
    }

    // Apply the position updates
    for (let [v, pos] of newPositions) {
      this.positions.set(v, pos);
    }
  }
}
