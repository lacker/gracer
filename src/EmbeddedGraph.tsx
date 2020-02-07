import PlanarGraph from "./PlanarGraph";
import { pairs } from "./Util";
import Vector from "./Vector";

export default class EmbeddedGraph {
  graph: PlanarGraph;
  positions: Map<number, Vector>;

  constructor(graph: PlanarGraph) {
    this.graph = graph;
    this.positions = new Map();
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

  center(face: number): Vector {
    let sum = Vector.zero();
    let num = 0;
    let boundary = this.graph.getBoundary(face);
    for (let v of boundary) {
      sum = sum.add(this.position(v));
      num++;
    }
    return sum.scale(num);
  }

  tick() {
    // We use a model of different forces to produce an embedding of
    // the graph that looks continuous, while also permitting change
    // over time.
    // Forcemap tracks the total force on each vertex as we sum up the
    // different forces acting on it.
    let forcemap = new Map<number, Vector>();
    let addForce = (v: number, force: Vector) => {
      let old = forcemap.get(v) || Vector.zero();
      forcemap.set(v, old.add(force));
    };

    // Spring forces
    for (let [v1, v2] of this.graph.edgesBothWays()) {
      // Calculate a spring force on v2
      let pos1 = this.position(v1);
      let pos2 = this.position(v2);
      let diff = pos2.sub(pos1);
      let target = pos1.add(diff.scaleTo(1));
      let linear = target.sub(pos2);
      let quadraticForce = linear.scale(0.5 * linear.length());
      addForce(v2, quadraticForce);
    }

    // Forces between edges and vertices of the same face
    for (let face of this.graph.faces()) {
      if (face === 0) {
        continue;
      }
      let boundary = this.graph.getBoundary(face);
      for (let [v1, v2] of pairs(boundary)) {
        // Check if the v1-v2 edge should repulse v3
        let pos1 = this.position(v1);
        let pos2 = this.position(v2);
        let diff = pos2.sub(pos1);
        let lineMass = diff.length();
        let unit = diff.scaleTo(1);
        // Since the face is on the right, the direction of repulsion
        // is to the right of the edge.
        let direction = unit.rotate(-Math.PI / 2);

        let base1 = direction.dot(pos1);
        let base2 = direction.dot(pos2);

        if (Math.abs(base1 - base2) > 0.01) {
          throw new Error("bad vector math");
        }

        for (let v3 of boundary) {
          if (v3 === v1 || v3 === v2) {
            continue;
          }

          let pos3 = this.position(v3);
          let current = direction.dot(pos3) - base1;
          let target = 0.25;
          if (current > target) {
            // This is fine
            continue;
          }

          let miss = target - current;
          let force = direction.scale(0.5 * lineMass * miss * miss);
          addForce(v3, force);
          addForce(v1, force.scale(-0.5));
          addForce(v2, force.scale(-0.5));
        }
      }
    }

    // Update positions
    for (let [vertex, force] of forcemap.entries()) {
      // Cap the force
      let cap = 0.1;
      if (force.length() > cap) {
        force = force.scaleTo(cap);
      }
      if (force.length() < 0.001) {
        continue;
      }
      this.positions.set(vertex, this.position(vertex).add(force));
    }

    if (this.positions.has(1)) {
      // Keep vertex 1 in the center
      let shift = this.position(1).scale(-1);
      for (let [vertex, position] of this.positions.entries()) {
        this.positions.set(vertex, position.add(shift));
      }
    }
  }
}
