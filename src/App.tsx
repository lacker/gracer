import React, { useEffect, useRef } from "react";
import { Canvas, useThree } from "react-three-fiber";
import "./App.css";

import Controls from "./Controls";
import EmbeddedGraph from "./EmbeddedGraph";
import GraphView from "./GraphView";
import PlanarGraph from "./PlanarGraph";

function Camera(props: any) {
  let camera = useRef<any>();
  let { setDefaultCamera } = useThree();
  useEffect(() => {
    setDefaultCamera(camera.current);
  }, [setDefaultCamera]);

  return <perspectiveCamera ref={camera} {...props} />;
}

function DraggableCanvas(props: {
  graph: PlanarGraph;
  embedded: EmbeddedGraph;
}) {
  return (
    <Canvas
      onClick={() => {
        console.log("ignoring left click");
      }}
      onContextMenu={e => {
        props.graph.rightClick();
      }}
      resize={{ scroll: false }}
      style={{ height: "100vh", backgroundColor: "#eeeeee" }}
    >
      <Camera position={[0, 0, 30]} />
      <pointLight position={[-20, 50, 100]} />
      <ambientLight intensity={0.5} />
      <GraphView graph={props.embedded} />
      <Controls />
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
