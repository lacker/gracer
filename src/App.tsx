import React, { useRef } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import "./App.css";

function Vertex(props: { x: number; y: number }) {
  return (
    <mesh visible position={[props.x, props.y, 0]} rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[0.2, 32, 32]} />
      <meshLambertMaterial color="#0000ff" attach="material" />
    </mesh>
  );
}

function Edge(props: { x1: number; y1: number; x2: number; y2: number }) {
  let x = (props.x1 + props.x2) / 2;
  let y = (props.y1 + props.y2) / 2;
  let dx = Math.abs(props.x1 - props.x2);
  let dy = Math.abs(props.y1 - props.y2);
  let dist = Math.sqrt(dx * dx + dy * dy);
  let angle = Math.atan2(dy, dx);
  return (
    <mesh visible position={[x, y, 0]} rotation={[0, 0, -angle]}>
      <boxGeometry attach="geometry" args={[dist, 0.1, 0.1]} />
      <meshLambertMaterial color="#777777" attach="material" />
    </mesh>
  );
}

export default function App() {
  let coords = [];
  for (let i = -10; i <= 10; i++) {
    coords.push(i);
  }
  return (
    <Canvas
      resize={{ scroll: false }}
      orthographic
      style={{ height: "100vh", backgroundColor: "#eeeeee" }}
      camera={{ zoom: 50 }}
    >
      <ambientLight intensity={1} />
      {coords.map(y => (
        <Vertex x={-10} y={y} />
      ))}
      <Vertex x={-5} y={0} />
      <Vertex x={0} y={0} />
      <Vertex x={5} y={0} />
      <Vertex x={10} y={0} />
      <Edge x1={-10} y1={5} x2={0} y2={0} />
    </Canvas>
  );
}
