import React, { useState } from "react";
import { Canvas } from "react-three-fiber";
import "./App.css";

import EmbeddedGraph from "./EmbeddedGraph";
import GraphView from "./GraphView";
import PlanarGraph from "./PlanarGraph";

function GraphViewWrapper(props: { graph: EmbeddedGraph }) {
  let [steps, setSteps] = useState(0);
  setTimeout(() => {
    // More ticks make the problem appear faster
    props.graph.graph.tick();
    props.graph.graph.tick();
    props.graph.graph.tick();
    props.graph.graph.tick();
    props.graph.graph.tick();
    props.graph.graph.tick();
    props.graph.graph.tick();
    props.graph.graph.tick();
    props.graph.step();
    setSteps(steps + 1);
  }, 100);
  return <GraphView graph={props.graph} steps={steps} />;
}

export default function App() {
  let graph = new PlanarGraph();
  let embedded = new EmbeddedGraph(graph);

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
      <GraphViewWrapper graph={embedded} />
    </Canvas>
  );
}
