import Graph from "./Graph";

type Edge = {
  left: number;
  right: number;
};

// Treating an array of numbers like a circular linked list, finds the
// sequence of numbers starting at first and ending at last.
// For example, chopCircle([1, 2, 3, 4], 3, 1) should be [3, 4, 1].
function chopCircle(circle: number[], first: number, last: number): number[] {
  let i = circle.indexOf(first);
  if (i < 0) {
    throw new Error(`${first} is not in circle ${circle}`);
  }
  let answer = [first];
  while (true) {
    i++;
    if (i >= circle.length) {
      i = 0;
    }
    if (circle[i] === first) {
      throw new Error(`bad chop ${circle} ${first} ${last}`);
    }
    answer.push(circle[i]);
    if (circle[i] === last) {
      return answer;
    }
  }
}

function pairs(list: number[]): number[][] {
  let answer: number[][] = [];
  for (let i = 1; i < list.length; i++) {
    answer.push([list[i - 1], list[i]]);
  }
  if (list.length > 1) {
    answer.push([list[list.length - 1], list[0]]);
  }
  return answer;
}

// PlanarGraph has some minimum requirements for its graphs.
// The graph must be connected.
// Each face must have at least three vertices, including the outer face.
// Vertices on a face may not be repeated.
// The minimum PlanarGraph is thus a triangle.
// A PlanarGraph with faces filled in is topologically a 2-sphere.
export default class PlanarGraph implements Graph {
  // If v1 -> v2 is an edge, edgemap[v1][v2] is information about it
  edgemap: Map<number, Map<number, Edge>>;
  nextv: number;

  // Each face has a numerical id.
  // facemap gives you its vertices, in clockwise order.
  // Face zero is special - it is the outer face, and may not be deleted.
  // Its vertices will seem to be listed counterclockwise on a single
  // plane, because it's like you're looking at the backside of a
  // sphere.
  facemap: Map<number, number[]>;
  nextf: number;

  version: number;

  // Creates a triangle with vertices:
  //
  //       1
  //      / \
  //     2---3
  //
  constructor() {
    this.nextv = 1;
    this.edgemap = new Map();
    this.addRawVertex();
    this.addRawVertex();
    this.addRawVertex();

    this.facemap = new Map();
    this.nextf = 0;
    this.addRawFace([1, 2, 3]);
    this.addRawFace([3, 2, 1]);

    this.version = 1;
  }

  // Adds a vertex that isn't connected to anything
  addRawVertex(): number {
    let answer = this.nextv;
    this.edgemap.set(answer, new Map());
    this.nextv++;
    return answer;
  }

  getOrCreateEdge(v1: number, v2: number): Edge {
    let v1map = this.edgemap.get(v1);
    if (!v1map) {
      throw new Error(`bad v1: ${v1}`);
    }
    let existing = v1map.get(v2);
    if (existing) {
      return existing;
    }
    let blank = { left: -1, right: -1 };
    v1map.set(v2, blank);
    return blank;
  }

  // Adds a face, overwriting other face information.
  // This creates edges when it needs to, inserting -1 for unknown faces.
  addRawFace(boundary: number[]): number {
    if (boundary.length < 3) {
      throw new Error(`face too small: ${boundary}`);
    }

    let face = this.nextf;
    this.nextf++;

    this.facemap.set(face, boundary);

    for (let [v1, v2] of pairs(boundary)) {
      let e1to2 = this.getOrCreateEdge(v1, v2);
      e1to2.right = face;
      let e2to1 = this.getOrCreateEdge(v2, v2);
      e2to1.left = face;
    }
    return face;
  }

  vertices(): number[] {
    return Array.from(this.edgemap.keys());
  }

  edges(): number[][] {
    let answer = [];
    for (let [v1, v1map] of this.edgemap) {
      for (let v2 of v1map.keys()) {
        if (v1 < v2) {
          answer.push([v1, v2]);
        }
      }
    }
    return answer;
  }

  neighbors(v: number): number[] {
    let vmap = this.edgemap.get(v);
    if (!vmap) {
      return [];
    }
    return Array.from(vmap.keys());
  }

  // Adds an edge to split the given face, between the given two vertices.
  addEdge(v1: number, v2: number, face: number) {
    let circle = this.facemap.get(face);
    if (!circle) {
      throw new Error(`no face ${face}`);
    }
    let from1to2 = chopCircle(circle, v1, v2);
    let from2to1 = chopCircle(circle, v2, v1);
    this.addRawFace(from1to2);
    this.addRawFace(from2to1);
    this.facemap.delete(face);
  }
}
