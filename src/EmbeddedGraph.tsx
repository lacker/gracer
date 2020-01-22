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

  vertices(): number[] {
    return this.graph.vertices();
  }

  step(): void {
    // Update positions in a batch at the end
    let newPositions = new Map<number, Vector>();

    for (let vertex of this.vertices()) {
      let vpos = this.positions.get(vertex);
      if (!vpos) {
        throw new Error("bad vpos");
      }
      let force = Vector.zero();
      for (let neighbor of this.graph.neighbors(vertex)) {
        let npos = this.positions.get(neighbor);
        if (!npos) {
          throw new Error("bad npos");
        }

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
