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

    // Figure out which faces are inverted
    let invertedFaces = new Set<number>();
    for (let face of this.graph.faces()) {
      if (this.signedArea(face) < 0) {
        invertedFaces.add(face);
      }
    }

    // Calculate center of mass
    let sum = Vector.zero();
    let num = 0;
    for (let v of this.vertices()) {
      sum = sum.add(this.position(v));
      num++;
    }
    let center = sum.scale(1 / num);

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

    // Start out with a small force towards the center of the graph, plus
    // a force away from the center of mass.
    // This nudges the graph towards the center without smushing it.
    for (let vertex of this.vertices()) {
      let vpos = this.position(vertex);
      addForce(vertex, vpos.scaleTo(-0.001));

      let outwards = vpos.sub(center).scaleTo(0.01);
      addForce(vertex, outwards);
    }

    // Spring forces
    for (let [v1, v2] of this.graph.edgesBothWays()) {
      // If both the faces are pointing the wrong way, it doesn't seem
      // like we should operate the spring.
      let edge = this.graph.getEdge(v1, v2);
      if (invertedFaces.has(edge.left) && invertedFaces.has(edge.right)) {
        continue;
      }

      // Calculate a spring force on v2
      let pos1 = this.position(v1);
      let pos2 = this.position(v2);
      let diff = pos2.sub(pos1);
      let target = pos1.add(diff.scaleTo(1));
      let linear = target.sub(pos2);
      let quadraticForce = linear.scale(0.5 * linear.length());
      addForce(v2, quadraticForce);
    }

    // Update positions
    for (let [vertex, force] of forcemap.entries()) {
      // Cap the force
      let cap = 0.5;
      if (force.length() > cap) {
        force = force.scaleTo(cap);
      }
      if (force.length() < 0.001) {
        continue;
      }
      this.positions.set(vertex, this.position(vertex).add(force));
    }

    return changed;
  }
}
