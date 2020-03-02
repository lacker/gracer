import React, { useRef } from "react";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";

import EmbeddedGraph from "./EmbeddedGraph";

function CenterDot() {
  return (
    <mesh visible position={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[0.1, 8, 8]} />
      <meshLambertMaterial color={"#000000"} attach="material" />
    </mesh>
  );
}

function Ball(props: { graph: EmbeddedGraph; vertex: number }) {
  let v = props.graph.position(props.vertex);
  let mesh = useRef<any>();
  useFrame(() => {
    let v = props.graph.position(props.vertex);
    if (!mesh.current) {
      return;
    }
    mesh.current.position.x = v.x;
    mesh.current.position.y = v.y;
    mesh.current.position.z = v.z;
  });
  let color = props.vertex === 1 ? "#000000" : "#0000ff";
  return (
    <mesh ref={mesh} visible position={[v.x, v.y, v.z]} rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[0.2, 8, 8]} />
      <meshLambertMaterial color={color} attach="material" />
    </mesh>
  );
}

function Rod(props: { graph: EmbeddedGraph; edge: number[] }) {
  let calculate = () => {
    let [vn1, vn2] = props.edge;
    let v1 = props.graph.position(vn1);
    let v2 = props.graph.position(vn2);
    let x = (v1.x + v2.x) / 2;
    let y = (v1.y + v2.y) / 2;
    let z = (v1.z + v2.z) / 2;
    let dx = v2.x - v1.x;
    let dy = v2.y - v1.y;
    let dz = v2.z - v1.z;
    let dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    let angle = Math.atan2(dy, dx);
    return { x, y, z, angle, dist };
  };

  let mesh = useRef<any>();
  useFrame(() => {
    if (!mesh.current) {
      return;
    }
    let { x, y, z, angle, dist } = calculate();
    mesh.current.position.x = x;
    mesh.current.position.y = y;
    mesh.current.position.z = z;
    mesh.current.scale.x = dist;
    mesh.current.rotation.z = angle;
  });

  let { x, y, z, angle, dist } = calculate();
  let geometry = new THREE.BoxGeometry(1, 0.1, 0.1);

  return (
    <mesh
      ref={mesh}
      visible
      position={[x, y, z]}
      rotation={[0, 0, angle]}
      scale={[dist, 1, 1]}
      geometry={geometry}
    >
      <meshLambertMaterial color="#777777" attach="material" />
    </mesh>
  );
}

function LiveGraphView(props: { graph: EmbeddedGraph; forceUpdate: number }) {
  useFrame(({ camera }) => {
    props.graph.tick();
    // camera.position.x += 0.01;
    // camera.updateProjectionMatrix();
  });

  return (
    <>
      <CenterDot />
      {props.graph.vertices().map(v => (
        <Ball graph={props.graph} vertex={v} key={`v${v}`} />
      ))}

      {props.graph.edges().map(e => (
        <Rod graph={props.graph} edge={e} key={`e${e.join("-")}`} />
      ))}
    </>
  );
}

export default class GraphView extends React.Component<
  { graph: EmbeddedGraph },
  {}
> {
  constructor(props: { graph: EmbeddedGraph }) {
    super(props);

    props.graph.graph.addUpdateListener(() => {
      this.forceUpdate();
    });
  }

  render() {
    return (
      <LiveGraphView graph={this.props.graph} forceUpdate={Math.random()} />
    );
  }
}
