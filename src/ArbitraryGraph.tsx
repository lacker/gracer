import Graph from "./Graph";

// An ArbitraryGraph is one where you can add vertices and edges willy nilly.

export default class ArbitraryGraph implements Graph {
  vset: Set<number>;
  edgemap: Map<number, number[]>;
  nextv: number;

  // Ticks up whenever the graph is mutated
  version: number;

  constructor() {
    this.vset = new Set<number>();
    this.edgemap = new Map<number, number[]>();
    this.nextv = 1;
    this.version = 1;
  }

  hasEdge(i: number, j: number): boolean {
    let edges = this.edgemap.get(i);
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
    return Array.from(this.vset);
  }

  chooseVertex(): number {
    let choices = Array.from(this.vset);
    return choices[Math.floor(Math.random() * choices.length)];
  }

  addVertex() {
    this.vset.add(this.nextv);
    this.edgemap.set(this.nextv, []);
    this.nextv++;
    this.version++;
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

  addRandomEdge() {
    if (this.vset.size < 2) {
      return;
    }

    for (let count = 0; count < 1000; count++) {
      let i = this.chooseVertex();
      let j = this.chooseVertex();
      if (i === j || this.hasEdge(i, j)) {
        continue;
      }
      this.neighbors(i).push(j);
      this.neighbors(j).push(i);
      this.version++;
      return;
    }

    throw new Error("graph is overedged");
  }
}
