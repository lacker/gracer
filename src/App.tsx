import React, { useRef } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import "./App.css";

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
      <pointLight position={[-20, 50, 100]} />
      <ambientLight intensity={0.5} />
      {coords.map(y => (
        <Ball x={-10} y={y} />
      ))}
      <Ball x={-5} y={0} />
      <Ball x={0} y={0} />
      <Ball x={5} y={0} />
      <Ball x={10} y={0} />
      <Rod x1={-10} y1={5} x2={0} y2={0} />
    </Canvas>
  );
}
