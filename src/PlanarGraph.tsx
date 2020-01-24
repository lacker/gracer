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

// Mutates circle
function insertAfter(circle: number[], item: number, after: number) {
  let index = circle.indexOf(after);
  if (index < 0) {
    throw new Error("bad insert");
  }
  circle.splice(index + 1, 0, item);
}

function intersect(list1: number[], list2: number[]): number[] {
  let answer = [];
  for (let item of list1) {
    if (list2.includes(item)) {
      answer.push(item);
    }
  }
  return answer;
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

  log() {
    for (let [v1, v1map] of this.edgemap.entries()) {
      for (let [v2, edge] of v1map.entries()) {
        console.log(`${v1}-${v2} L${edge.left} R${edge.right}`);
      }
    }

    for (let [face, boundary] of this.facemap.entries()) {
      console.log(`face ${face}: ${boundary.join(",")}`);
    }
  }

  addRawFace(boundary: number[]): number {
    let face = this.nextf;
    this.nextf++;
    this.setRawFace(face, boundary);
    return face;
  }

  // Adds a face, overwriting other face information.
  // This creates edges when it needs to, inserting -1 for unknown faces.
  setRawFace(face: number, boundary: number[]) {
    if (boundary.length < 3) {
      throw new Error(`face too small: ${boundary}`);
    }

    this.facemap.set(face, boundary);

    for (let [v1, v2] of pairs(boundary)) {
      let e1to2 = this.getOrCreateEdge(v1, v2);
      e1to2.right = face;
      let e2to1 = this.getOrCreateEdge(v2, v1);
      e2to1.left = face;
    }
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

  // Adds a new vertex on the edge between two vertices that are currently connected.
  addVertex(v1: number, v2: number): number {
    // Remove the old edge, tracking left and right.
    let v1map = this.edgemap.get(v1);
    let v2map = this.edgemap.get(v2);
    if (!v1map || !v2map) {
      throw new Error("bad vertex in addVertex");
    }
    let e1to2 = v1map.get(v2);
    let e2to1 = v2map.get(v1);
    if (!e1to2 || !e2to1) {
      throw new Error("no edge to split");
    }
    let { left, right } = e1to2;
    if (e2to1.left !== right || e2to1.right !== left) {
      throw new Error(
        `${v1}-${v2} is ${JSON.stringify(e1to2)}` +
          ` but ${v2}-${v1} is ${JSON.stringify(e2to1)}`
      );
    }
    v1map.delete(v2);
    v2map.delete(v1);
    let newV = this.addRawVertex();

    // On the right face, the new vertex is after v1
    let rightBoundary = this.getBoundary(right);
    let newRightBoundary = [...rightBoundary];
    insertAfter(newRightBoundary, newV, v1);
    this.setRawFace(right, newRightBoundary);

    // On the left face, the new vertex is after v2
    let leftBoundary = this.getBoundary(left);
    let newLeftBoundary = [...leftBoundary];
    insertAfter(newLeftBoundary, newV, v2);
    this.setRawFace(left, newLeftBoundary);

    this.version++;
    return newV;
  }

  // Adds an edge to split the given face, between the given two
  // vertices.
  // The longer of the two keeps the existing face number.
  addEdge(v1: number, v2: number, face: number) {
    let circle = this.getBoundary(face);
    let from1to2 = chopCircle(circle, v1, v2);
    let from2to1 = chopCircle(circle, v2, v1);
    let longer, shorter;
    if (from1to2.length < from2to1.length) {
      [longer, shorter] = [from2to1, from1to2];
    } else {
      [longer, shorter] = [from1to2, from2to1];
    }
    this.addRawFace(shorter);
    this.setRawFace(face, longer);
    this.version++;
  }

  // Fails if there is no such vertex
  getVertexMap(v: number): Map<number, Edge> {
    let answer = this.edgemap.get(v);
    if (!answer) {
      throw new Error(`no vertex map for ${v}`);
    }
    return answer;
  }

  // Fails if there is no such edge
  getEdge(v1: number, v2: number): Edge {
    let edge = this.getVertexMap(v1).get(v2);
    if (!edge) {
      throw new Error("no edge");
    }
    return edge;
  }

  // Fails if there is no such boundary
  getBoundary(face: number): number[] {
    let boundary = this.facemap.get(face);
    if (!boundary) {
      throw new Error("no such face");
    }
    return boundary;
  }

  canRemoveEdge(v1: number, v2: number): boolean {
    let edge = this.getEdge(v1, v2);
    let left = this.getBoundary(edge.left);
    let right = this.getBoundary(edge.right);
    return intersect(left, right).length === 2;
  }

  removeEdge(v1: number, v2: number) {
    let edge = this.getEdge(v1, v2);
    let left = this.getBoundary(edge.left);
    let right = this.getBoundary(edge.right);
    this.facemap.delete(edge.left);
    this.facemap.delete(edge.right);
    this.getVertexMap(v1).delete(v2);
    this.getVertexMap(v2).delete(v1);

    // Create a new face by zipping left and right together
    // Reuse the lower face id so it works with the outer face
    let newFace = Math.min(edge.left, edge.right);
    let leftPart = chopCircle(left, v1, v2);
    leftPart.pop();
    let rightPart = chopCircle(right, v2, v1);
    rightPart.pop();
    let newBoundary = leftPart.concat(rightPart);

    this.setRawFace(newFace, newBoundary);
    this.version++;
  }

  degree(v: number): number {
    return this.neighbors(v).length;
  }

  randomFace(): number {
    let faces = Array.from(this.facemap.keys());
    return faces[Math.floor(Math.random() * faces.length)];
  }

  randomEdge(): number[] {
    let all = this.edges();
    return all[Math.floor(Math.random() * all.length)];
  }

  tryToRandomlySplitFace(face: number): boolean {
    let boundary = this.getBoundary(face);
    if (boundary.length < 4) {
      return false;
    }
    if (face === 0) {
      return false;
    }
    let index1 = Math.floor(boundary.length * Math.random());
    // Split into a triangle and one other part.
    let index2 = (index1 + 2) % boundary.length;
    this.addEdge(boundary[index1], boundary[index2], face);
    return true;
  }

  randomlyMutate() {
    let [v1, v2] = this.randomEdge();
    let edge = this.getEdge(v1, v2);
    let faces: number[];
    if (Math.random() < 0.5) {
      faces = [edge.left, edge.right];
    } else {
      faces = [edge.right, edge.left];
    }

    for (let face of faces) {
      if (this.tryToRandomlySplitFace(face)) {
        return;
      }
    }

    if (this.canRemoveEdge(v1, v2)) {
      this.removeEdge(v1, v2);
    } else {
      this.addVertex(v1, v2);
    }
  }
}
