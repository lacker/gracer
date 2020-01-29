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
    graph.tick();
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
      orthographic
      style={{ height: "100vh", backgroundColor: "#eeeeee" }}
      camera={{ zoom: 50 }}
    >
      <pointLight position={[-20, 50, 100]} />
      <ambientLight intensity={0.5} />
      <GraphView graph={embedded} />
    </Canvas>
  );
}
