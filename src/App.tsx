import React, { useRef } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import "./App.css";

function Ball(props: { x: number; y: number }) {
  return (
    <mesh visible position={[props.x, props.y, -5]} rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[1, 32, 32]} />
      <meshNormalMaterial attach="material" />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas style={{ height: "100vh", backgroundColor: "#333333" }}>
      <Ball x={-10} y={-10} />
      <Ball x={-10} y={-5} />
      <Ball x={-10} y={0} />
      <Ball x={-10} y={5} />
      <Ball x={-10} y={10} />
      <Ball x={-5} y={0} />
      <Ball x={0} y={0} />
      <Ball x={5} y={0} />
      <Ball x={10} y={0} />
    </Canvas>
  );
}
