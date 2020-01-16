import React, { useRef } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import "./App.css";

function Thing() {
  let ref: any = useRef();
  useFrame(() => (ref.current.rotation.x = ref.current.rotation.y += 0.01));
  return (
    <mesh
      ref={ref}
      onClick={e => console.log("click")}
      onPointerOver={e => console.log("hover")}
      onPointerOut={e => console.log("unhover")}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshNormalMaterial attach="material" />
    </mesh>
  );
}

function Ball() {
  return (
    <mesh visible position={[1, 2, 3]} rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[1, 16, 16]} />
      <meshStandardMaterial attach="material" color="hotpink" />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas style={{ height: "100vh", backgroundColor: "#333333" }}>
      <Thing />
      <Ball />
    </Canvas>
  );
}
