import React, { useState } from "react";
import { Canvas } from "react-three-fiber";
import "./App.css";

import Graph from "./Graph";

function Ball(props: { x: number; y: number }) {
  return (
    <mesh visible position={[props.x, props.y, 0]} rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[0.2, 32, 32]} />
      <meshLambertMaterial color="#0000ff" attach="material" />
    </mesh>
  );
}

function Rod(props: { x1: number; y1: number; x2: number; y2: number }) {
  let x = (props.x1 + props.x2) / 2;
  let y = (props.y1 + props.y2) / 2;
  let dx = props.x2 - props.x1;
  let dy = props.y2 - props.y1;
  let dist = Math.sqrt(dx * dx + dy * dy);
  let angle = Math.atan2(dy, dx);
  return (
    <mesh visible position={[x, y, 0]} rotation={[0, 0, angle]}>
      <boxGeometry attach="geometry" args={[dist, 0.1, 0.1]} />
      <meshLambertMaterial color="#777777" attach="material" />
    </mesh>
  );
}

export default function App() {
  let [ticks, setTicks] = useState(0);
  let [graph, setGraph] = useState(() => {
    let graph = new Graph();

    for (let i = 0; i < 10; i++) {
      graph.addRandomVertex();
    }
    for (let i = 0; i < 20; i++) {
      graph.addRandomEdge();
    }
    return graph;
  });

  return (
    <Canvas
      onClick={() => {
        graph.step();
        setGraph(graph);
        setTicks(ticks + 1);
      }}
      resize={{ scroll: false }}
      orthographic
      style={{ height: "100vh", backgroundColor: "#eeeeee" }}
      camera={{ zoom: 50 }}
    >
      <pointLight position={[-20, 50, 100]} />
      <ambientLight intensity={0.5} />

      {graph.vertices.map(v => (
        <Ball x={v.x} y={v.y} key={Math.random()} />
      ))}

      {graph.edges().map(([v1, v2]) => (
        <Rod x1={v1.x} y1={v1.y} x2={v2.x} y2={v2.y} key={Math.random()} />
      ))}
    </Canvas>
  );
}
