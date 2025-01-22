"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, extend } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

import CardModel from "src/components/three/card/model";

extend({ MeshLineGeometry, MeshLineMaterial });

const CardCanvas = () => {
  return (
    <section className="h-dvh w-full bg-white">
      <Canvas
        gl={{ antialias: true }}
        camera={{ position: [0, 0, 13], fov: 25 }}
      >
        <ambientLight intensity={Math.PI} />

        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <CardModel />
        </Physics>

        <Environment background resolution={1024} blur={0.75}>
          <color attach="background" args={["#ffffff"]} />
          <Lightformer
            intensity={4}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={6}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={12}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={40}
            color="white"
            position={[-15, 0, 15]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </section>
  );
};

export default CardCanvas;
