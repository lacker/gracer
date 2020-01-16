import React, { useRef } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import "./App.css";

function Vertex(props: { x: number; y: number }) {
  return (
    <mesh visible position={[props.x, props.y, 0]} rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[0.2, 32, 32]} />
      <meshNormalMaterial attach="material" />
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
      style={{ height: "100vh", backgroundColor: "#222222" }}
      camera={{ zoom: 50 }}
    >
      {coords.map(y => (
        <Vertex x={-10} y={y} />
      ))}
      <Vertex x={-5} y={0} />
      <Vertex x={0} y={0} />
      <Vertex x={5} y={0} />
      <Vertex x={10} y={0} />
    </Canvas>
  );
}
