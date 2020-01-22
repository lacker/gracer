type Vector = { x: number; y: number };

export default interface Graph {
  step(): void;

  vertices(): Vector[];

  // Returns a list of [vertex1, vertex2] edges
  edges(): Vector[][];
}
