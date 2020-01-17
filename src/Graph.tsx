type Vector = { x: number; y: number };
type Vertex = { x: number; y: number; edges: number[] };

function zeroVector(): Vector {
  return { x: 0, y: 0 };
}

function epsilonVector(): Vector {
  return { x: 0.0001, y: 0.0001 };
}

function add(v1: Vector, v2: Vector): Vector {
  return { x: v1.x + v2.x, y: v1.y + v2.y };
}

function scale(k: number, v: Vector): Vector {
  return { x: k * v.x, y: k * v.y };
}

function dot(v1: Vector, v2: Vector): number {
  return v1.x * v2.x + v1.y * v2.y;
}

function sub(v1: Vector, v2: Vector): Vector {
  return add(v1, scale(-1, v2));
}

function len(v: Vector): number {
  return Math.sqrt(dot(v, v));
}

function scaleTo(k: number, v: Vector): Vector {
  if (len(v) === 0) {
    v = epsilonVector();
  }
  return scale(k / len(v), v);
}

function randomCoordinate() {
  return -10 + Math.random() * 20;
}

export default class Graph {
  vertices: Vertex[];

  constructor() {
    this.vertices = [];
  }

  hasEdge(i: number, j: number): boolean {
    let v = this.vertices[i];
    if (!v) {
      return false;
    }
    for (let out of v.edges) {
      if (out === j) {
        return true;
      }
    }
    return false;
  }

  chooseVertex(): number {
    return Math.floor(this.vertices.length * Math.random());
  }

  addRandomVertex() {
    this.vertices.push({
      x: randomCoordinate(),
      y: randomCoordinate(),
      edges: []
    });
  }

  isEmpty(): boolean {
    return this.vertices.length === 0;
  }

  step(): void {
    // An array, parallel to this.vertices, of {x, y} forces on them.
    let forces = [];

    for (let vertex of this.vertices) {
      let force = zeroVector();
      for (let index of vertex.edges) {
        let neighbor = this.vertices[index];

        // Figure out the target spot where we should be
        let diff = sub(vertex, neighbor);
        let idealDiff = scaleTo(1, diff);
        let target = add(neighbor, idealDiff);

        // This is linear rather than quadratic like a real spring
        let deltaForce = sub(target, vertex);
        force = add(force, deltaForce);
      }

      // Cap the force
      let cap = 0.05;
      if (len(force) > cap) {
        force = scaleTo(cap, force);
      }
      forces.push(force);
    }

    // Apply the forces
    for (let i = 0; i < this.vertices.length; i++) {
      let newV = add(this.vertices[i], forces[i]);
      this.vertices[i] = { ...this.vertices[i], ...newV };
    }
  }

  // Returns a list of [vertex1, vertex2] edges
  edges(): Vertex[][] {
    let answer = [];
    for (let i = 0; i < this.vertices.length; i++) {
      let vertex = this.vertices[i];
      for (let j of vertex.edges) {
        if (i < j) {
          answer.push([vertex, this.vertices[j]]);
        }
      }
    }
    return answer;
  }

  addRandomEdge() {
    if (this.vertices.length < 2) {
      return;
    }

    for (let count = 0; count < 1000; count++) {
      let i = this.chooseVertex();
      let j = this.chooseVertex();
      if (i === j || this.hasEdge(i, j)) {
        continue;
      }
      this.vertices[i].edges.push(j);
      this.vertices[j].edges.push(i);
      return;
    }

    throw new Error("graph is overedged");
  }
}
