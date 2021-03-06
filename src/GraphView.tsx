import React, { useRef } from "react";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";

import EmbeddedGraph from "./EmbeddedGraph";
import Vector from "./Vector";

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
  let color = "#0000ff";
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
    let delta = v2.sub(v1);
    let distance = delta.length();
    let center = v1.add(v2).scale(0.5);
    let normalX = new Vector(1, 0, 0);
    let normalD = delta.normalize();
    let quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(normalX.toVector3(), normalD.toVector3());
    return { center, quaternion, distance };
  };

  let mesh = useRef<any>();
  useFrame(() => {
    if (!mesh.current) {
      return;
    }
    let { center, quaternion, distance } = calculate();
    mesh.current.position.x = center.x;
    mesh.current.position.y = center.y;
    mesh.current.position.z = center.z;
    mesh.current.scale.x = distance;
    mesh.current.quaternion.set(
      quaternion.x,
      quaternion.y,
      quaternion.z,
      quaternion.w
    );
  });

  let { center, quaternion, distance } = calculate();
  let geometry = new THREE.BoxGeometry(1, 0.1, 0.1);

  return (
    <mesh
      ref={mesh}
      visible
      position={[center.x, center.y, center.z]}
      quaternion={quaternion}
      scale={[distance, 1, 1]}
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
