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

  vertices(): number[] {
    let answer = [];
    for (let i = 0; i < this.vlist.length; i++) {
      answer.push(i);
    }
    return answer;
  }

  chooseVertex(): number {
    return Math.floor(this.vlist.length * Math.random());
  }

  xvertices(): Vector[] {
    return [...this.vlist];
  }

  addRandomVertex() {
    this.vlist.push(new Vector(randomCoordinate(), randomCoordinate()));
    this.edgelist.push([]);
  }

  isEmpty(): boolean {
    return this.vlist.length === 0;
  }

  neighbors(v: number): number[] {
    return this.edgelist[v];
  }

  // Returns a list of [vertex1, vertex2] edges
  xedges(): Vector[][] {
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

  edges(): number[][] {
    let answer = [];
    for (let i = 0; i < this.vlist.length; i++) {
      for (let j of this.edgelist[i]) {
        if (i < j) {
          answer.push([i, j]);
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
