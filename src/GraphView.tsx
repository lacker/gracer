import React, { useState } from "react";
import { useFrame } from "react-three-fiber";

import Graph from "./Graph";

function Ball(props: { graph: Graph; vertex: number }) {
  let v = props.graph.xvertices()[props.vertex];
  return (
    <mesh visible position={[v.x, v.y, 0]} rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[0.2, 32, 32]} />
      <meshLambertMaterial color="#0000ff" attach="material" />
    </mesh>
  );
}

function Rod(props: { graph: Graph; edge: number[] }) {
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
  return (
    <mesh visible position={[x, y, 0]} rotation={[0, 0, angle]}>
      <boxGeometry attach="geometry" args={[dist, 0.1, 0.1]} />
      <meshLambertMaterial color="#777777" attach="material" />
    </mesh>
  );
}

export default function GraphView(props: { graph: Graph }) {
  let [ticks, setTicks] = useState(0);
  useFrame(() => {
    props.graph.step();
    setTicks(ticks + 1);
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
