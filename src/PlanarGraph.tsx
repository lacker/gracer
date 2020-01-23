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
    this.nextv = 1;
    this.vset = new Set();
    this.addRawVertex();
    this.addRawVertex();
    this.addRawVertex();

    this.facemap = new Map();
    this.nextf = 0;
    this.addRawFace([1, 2, 3]);
    this.addRawFace([3, 2, 1]);

    this.edgemap = new Map();
    this.addRawEdge(1, 2);
    this.addRawEdge(2, 3);
    this.addRawEdge(3, 1);

    this.version = 1;
  }

  // The addRaw functions don't maintain vertex/edge/face consistency

  addRawVertex(): number {
    let answer = this.nextv;
    this.vset.add(answer);
    this.edgemap.set(answer, []);
    this.nextv++;
    return answer;
  }

  addRawEdge(v1: number, v2: number) {
    this.neighbors(v1).push(v2);
    this.neighbors(v2).push(v1);
  }

  addRawFace(boundary: number[]) {
    this.facemap.set(this.nextf, boundary);
    this.nextf++;
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
  addVertex(face: number, n1: number, n2: number) {
    let circle = this.facemap.get(face);
    if (!circle) {
      throw new Error(`no face ${face}`);
    }
    let i1 = circle.indexOf(n1);
    let i2 = circle;
  }
}
