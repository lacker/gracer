import Vector from "./Vector";

export default interface Graph {
  step(): void;

  // A list of int ids for the vertices
  vertices(): number[];

  // A list of [int, int] edges
  edges(): number[][];

  xvertices(): Vector[];

  // Returns a list of [vertex1, vertex2] edges
  xedges(): Vector[][];
}
