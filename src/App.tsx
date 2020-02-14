import React, { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "react-three-fiber";
import "./App.css";

import EmbeddedGraph from "./EmbeddedGraph";
import GraphView from "./GraphView";
import PlanarGraph from "./PlanarGraph";

function Camera(props: any) {
  let ref = useRef<any>();
  let { setDefaultCamera } = useThree();
  useEffect(
    () => {
      setDefaultCamera(ref.current);
    },
    [setDefaultCamera]
  );

  return <perspectiveCamera ref={ref} {...props} />;
}

function DraggableCanvas(props: {
  graph: PlanarGraph;
  embedded: EmbeddedGraph;
}) {
  let [shift, setShift] = useState(0);

  return (
    <Canvas
      onClick={() => {
        setShift(shift + 0.1);
      }}
      onContextMenu={e => {
        e.preventDefault();
        props.graph.rightClick();
      }}
      resize={{ scroll: false }}
      style={{ height: "100vh", backgroundColor: "#eeeeee" }}
    >
      <Camera position={[shift, 0, 30]} />
      <pointLight position={[-20, 50, 100]} />
      <ambientLight intensity={0.5} />
      <GraphView graph={props.embedded} />
    </Canvas>
  );
}

export default function App() {
  let graph = new PlanarGraph();
  let embedded = new EmbeddedGraph(graph);

  setInterval(() => {
    graph.mutate();
  }, 1000);

  return <DraggableCanvas graph={graph} embedded={embedded} />;
}
