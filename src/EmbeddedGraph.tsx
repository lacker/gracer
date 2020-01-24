import PlanarGraph from "./PlanarGraph";
import { pairs } from "./Util";
import Vector from "./Vector";

export default class EmbeddedGraph {
  graph: PlanarGraph;
  positions: Map<number, Vector>;
  version: number;

  constructor(graph: PlanarGraph) {
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

  // If the vertices are correctly clockwise, reports the area.
  // If the vertices are all counterclockwise, reports negative area.
  // It returns some arbitrary positive number for the outside face to
  // indicate everything is okay out there.
  // If it's self-intersecting then it depends.
  // See https://www.mathopenref.com/coordpolygonarea.html for formula
  signedArea(face: number): number {
    if (face === 0) {
      return 100;
    }
    let boundary = this.graph.getBoundary(face);
    let sum = 0;
    for (let [v1, v2] of pairs(boundary)) {
      let pos1 = this.position(v1);
      let pos2 = this.position(v2);
      sum += pos1.y * pos2.x - pos1.x * pos2.y;
    }
    return sum / 2;
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

  // Returns whether the elements have changed
  step(): boolean {
    let changed = false;
    if (this.version !== this.graph.version) {
      this.version = this.graph.version;
      changed = true;
    }

    // Update positions in a batch at the end
    let newPositions = new Map<number, Vector>();

    // Calculate center of mass
    let sum = Vector.zero();
    let num = 0;
    for (let v of this.vertices()) {
      sum = sum.add(this.position(v));
      num++;
    }
    let center = sum.scale(1 / num);

    for (let vertex of this.vertices()) {
      let vpos = this.position(vertex);

      // Start out with a small force towards the center of the graph, plus
      // a force away from the center of mass.
      // This nudges the graph towards the center.
      let force = vpos.scaleTo(-0.001);
      let outwards = vpos.sub(center);
      force = force.add(outwards.scaleTo(0.005));

      for (let neighbor of this.graph.neighbors(vertex)) {
        // Simulate a spring for each edge.
        // Scale quadratically like a real spring
        let npos = this.position(neighbor);
        let diff = vpos.sub(npos);
        let idealDiff = diff.scaleTo(1);
        let target = npos.add(idealDiff);
        let delta = target.sub(vpos);
        let springForce = delta.scale(0.5 * delta.length());
        force = force.add(springForce);
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
