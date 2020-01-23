import Graph from "./Graph";
import Vector from "./Vector";

export default class EmbeddedGraph {
  graph: Graph;
  positions: Map<number, Vector>;
  version: number;

  constructor(graph: Graph) {
    this.graph = graph;
    this.positions = new Map();
    this.version = this.graph.version;
  }

  position(v: number): Vector {
    let answer = this.positions.get(v);
    if (!answer) {
      // Estimate a position by averaging the neighbors
      let num = 0;
      let sum = Vector.zero();
      for (let neighbor of this.graph.neighbors(v)) {
        let pos = this.positions.get(neighbor);
        if (!pos) {
          continue;
        }
        num++;
        sum = sum.add(pos);
      }
      if (num >= 2) {
        answer = sum.scale(1 / num).add(Vector.epsilon());
      } else if (num === 1) {
        answer = Vector.random();
      } else {
        answer = Vector.zero();
      }
      this.positions.set(v, answer);
    }
    return answer;
  }

  vertices(): number[] {
    return this.graph.vertices();
  }

  edges(): number[][] {
    return this.graph.edges();
  }

  // Returns whether the elements have changed
  step(): boolean {
    let changed = false;
    if (this.version !== this.graph.version) {
      this.version = this.graph.version;
      changed = true;
    }

    // Update positions in a batch at the end
    let newPositions = new Map<number, Vector>();

    for (let vertex of this.vertices()) {
      let vpos = this.position(vertex);
      let force = vpos.scaleTo(-0.001);
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

    return changed;
  }
}
