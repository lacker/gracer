import React, { useRef } from "react";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";

import Graph from "./Graph";

function Ball(props: { graph: Graph; vertex: number }) {
  let v = props.graph.xvertices()[props.vertex];
  let mesh = useRef<any>();
  useFrame(() => {
    let v = props.graph.xvertices()[props.vertex];
    mesh.current.position.x = v.x;
    mesh.current.position.y = v.y;
  });
  return (
    <mesh ref={mesh} visible position={[v.x, v.y, 0]} rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[0.2, 32, 32]} />
      <meshLambertMaterial color="#0000ff" attach="material" />
    </mesh>
  );
}

function Rod(props: { graph: Graph; edge: number[] }) {
  let calculate = () => {
    let vs = props.graph.xvertices();
    let [vn1, vn2] = props.edge;
    let v1 = vs[vn1];
    let v2 = vs[vn2];
    let x = (v1.x + v2.x) / 2;
    let y = (v1.y + v2.y) / 2;
    let dx = v2.x - v1.x;
    let dy = v2.y - v1.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    let angle = Math.atan2(dy, dx);
    let geometry = new THREE.BoxGeometry(dist, 0.1, 0.1);
    return { x, y, angle, geometry };
  };
  let { x, y, angle, geometry } = calculate();
  let mesh = useRef<any>();
  useFrame(() => {
    let { x, y, angle, geometry } = calculate();
    mesh.current.position.x = x;
    mesh.current.position.y = y;
    mesh.current.geometry.dispose();
    mesh.current.geometry = geometry;
    mesh.current.rotation.z = angle;
  });
  return (
    <mesh
      ref={mesh}
      visible
      position={[x, y, 0]}
      rotation={[0, 0, angle]}
      geometry={geometry}
    >
      <meshLambertMaterial color="#777777" attach="material" />
    </mesh>
  );
}

export default function GraphView(props: { graph: Graph }) {
  useFrame(() => {
    props.graph.step();
  });
  return (
    <>
      {props.graph.vertices().map(v => (
        <Ball graph={props.graph} vertex={v} key={Math.random()} />
      ))}

      {props.graph.edges().map(e => (
        <Rod graph={props.graph} edge={e} key={Math.random()} />
      ))}
    </>
  );
}
