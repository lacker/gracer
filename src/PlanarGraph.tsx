import Graph from "./Graph";

// PlanarGraph has some minimum requirements for its graphs.
// The graph must be connected.
// Each face must have at least three vertices, including the outer face.
// Vertices on a face may not be repeated.
// The minimum PlanarGraph is thus a triangle.
// A PlanarGraph with faces filled in is topologically a 2-sphere.
export default class PlanarGraph implements Graph {
  vset: Set<number>;
  nextv: number;

  // Each face has a numerical id.
  // facemap gives you its vertices, in clockwise order.
  // Face zero is special - it is the outer face, and may not be deleted.
  // Its vertices will seem to be listed counterclockwise on a single
  // plane, because it's like you're looking at the backside of a
  // sphere.
  facemap: Map<number, number[]>;
  nextf: number;

  edgemap: Map<number, number[]>;
  version: number;

  // Creates a triangle with vertices:
  //
  //       1
  //      / \
  //     2---3
  //
  constructor() {
    this.vset = new Set(1, 2, 3);
    this.nextv = 4;
    this.facemap = new Map();
    this.facemap.set(0, [1, 2, 3]);
    this.facemap.set(1, [1, 3, 2]);
    this.nextf = 2;
    this.edgemap = new Map();
    this.edgemap.set(1, [2, 3]);
    this.edgemap.set(2, [1, 3]);
    this.edgemap.set(3, [1, 2]);
    this.version = 1;
  }

  vertices(): number[] {
    return Array.from(this.vset);
  }

  neighbors(v: number): number[] {
    return this.edgemap.get(v) || [];
  }

  edges(): number[][] {
    let answer = [];
    for (let i of this.vset) {
      for (let j of this.neighbors(i)) {
        if (i < j) {
          answer.push([i, j]);
        }
      }
    }
    return answer;
  }

  // Adds a vertex in the given face, with two neighbors.
  addVertex(face: number, n1: number, n2: number) {}
}
