type Vector = { x: number; y: number };

export default interface Graph {
  step(): void;

  // TODO: rename to vertices()
  getVertices(): Vector[];

  // Returns a list of [vertex1, vertex2] edges
  edges(): Vector[][];
}
