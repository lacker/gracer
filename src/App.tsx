import React from "react";
import { Canvas } from "react-three-fiber";
import "./App.css";

import EmbeddedGraph from "./EmbeddedGraph";
import GraphView from "./GraphView";
import PlanarGraph from "./PlanarGraph";

export default function App() {
  let graph = new PlanarGraph();
  let embedded = new EmbeddedGraph(graph);

  setInterval(() => {
    graph.mutate();
  }, 100);

  return (
    <Canvas
      onClick={() => {
        graph.leftClick();
      }}
      onContextMenu={e => {
        e.preventDefault();
        graph.rightClick();
      }}
      resize={{ scroll: false }}
      style={{ height: "100vh", backgroundColor: "#eeeeee" }}
      camera={{ position: [0, 0, 20] }}
    >
      <pointLight position={[-20, 50, 100]} />
      <ambientLight intensity={0.5} />
      <GraphView graph={embedded} />
    </Canvas>
  );
}
