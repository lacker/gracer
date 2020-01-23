import React, { useState } from "react";
import { Canvas } from "react-three-fiber";
import "./App.css";

import ArbitraryGraph from "./ArbitraryGraph";
import EmbeddedGraph from "./EmbeddedGraph";
import GraphView from "./GraphView";
import PlanarGraph from "./PlanarGraph";

export default function App() {
  let makeGraph = () => {
    let graph = new ArbitraryGraph();
    for (let i = 0; i < 20; i++) {
      graph.addVertex();
    }
    for (let i = 0; i < 30; i++) {
      graph.addRandomEdge();
    }
    return graph;
  };
  let [graph, setGraph] = useState(makeGraph);
  let embedded = new EmbeddedGraph(graph);

  return (
    <Canvas
      onClick={() => {
        if (graph.vertices().length >= 100) {
          setGraph(makeGraph());
        } else {
          graph.addVertex();
          graph.addRandomEdge();
        }
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
