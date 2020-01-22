import Vector from "./Vector";

export default interface Graph {
  // A list of int ids for the vertices
  vertices(): number[];

  // A list of [int, int] edges
  edges(): number[][];

  // The edges for a vertex
  neighbors(v: number): number[];
}
