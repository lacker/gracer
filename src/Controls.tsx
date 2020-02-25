import React, { useRef } from "react";
import { ReactThreeFiber, extend, useThree, useFrame } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* eslint-disable */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<
        OrbitControls,
        typeof OrbitControls
      >;
    }
  }
}
/* eslint-enable */

extend({ OrbitControls });

function Controls() {
  const controlsRef = useRef<any>();
  const { camera, gl } = useThree();

  useFrame(() => {
    controlsRef?.current?.update();
  });

  return (
    <orbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableRotate
      enablePan={false}
      maxDistance={100}
      minDistance={5}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2}
    />
  );
}

export default Controls;
