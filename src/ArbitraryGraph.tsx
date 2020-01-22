import Graph from "./Graph";
import Vector from "./Vector";

// An ArbitraryGraph is one where you can add vertices and edges willy nilly.

function randomCoordinate() {
  return -10 + Math.random() * 20;
}

export default class ArbitraryGraph implements Graph {
  vlist: Vector[];
  edgelist: number[][];

  constructor() {
    this.vlist = [];
    this.edgelist = [];
  }

  hasEdge(i: number, j: number): boolean {
    let edges = this.edgelist[i];
    if (!edges) {
      return false;
    }
    for (let out of edges) {
      if (out === j) {
        return true;
      }
    }
    return false;
  }

  chooseVertex(): number {
    return Math.floor(this.vlist.length * Math.random());
  }

  vertices(): Vector[] {
    return [...this.vlist];
  }

  addRandomVertex() {
    this.vlist.push(new Vector(randomCoordinate(), randomCoordinate()));
    this.edgelist.push([]);
  }

  isEmpty(): boolean {
    return this.vlist.length === 0;
  }

  step(): void {
    // An array, parallel to this.vlist, of forces on them.
    let forces = [];

    for (let i = 0; i < this.vlist.length; i++) {
      let vertex = this.vlist[i];
      let force = Vector.zero();
      let edges = this.edgelist[i];
      for (let j of edges) {
        let neighbor = this.vlist[j];

        // Figure out the target spot where we should be
        let diff = vertex.sub(neighbor);
        let idealDiff = diff.scaleTo(1);
        let target = neighbor.add(idealDiff);

        // Scale quadratically like a real spring
        let delta = target.sub(vertex);
        let partialForce = delta.scale(0.5 * delta.length());
        force = force.add(partialForce);
      }

      // Cap the force
      let cap = 0.5;
      if (force.length() > cap) {
        force = force.scaleTo(cap);
      }
      forces.push(force);
    }

    // Apply the forces
    for (let i = 0; i < this.vlist.length; i++) {
      if (forces[i].length() < 0.001) {
        continue;
      }
      this.vlist[i] = this.vlist[i].add(forces[i]);
    }
  }

  // Returns a list of [vertex1, vertex2] edges
  edges(): Vector[][] {
    let answer = [];
    for (let i = 0; i < this.vlist.length; i++) {
      let vertex = this.vlist[i];
      for (let j of this.edgelist[i]) {
        if (i < j) {
          answer.push([vertex, this.vlist[j]]);
        }
      }
    }
    return answer;
  }

  addRandomEdge() {
    if (this.vlist.length < 2) {
      return;
    }

    for (let count = 0; count < 1000; count++) {
      let i = this.chooseVertex();
      let j = this.chooseVertex();
      if (i === j || this.hasEdge(i, j)) {
        continue;
      }
      this.edgelist[i].push(j);
      this.edgelist[j].push(i);
      return;
    }

    throw new Error("graph is overedged");
  }
}
