import { BakeShadows, MeshReflectorMaterial } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { MathUtils } from "three";

import CameraRig from "~/components/home/CameraRig";
import Computer from "~/components/home/Computer";

const Scene = () => {
  return (
    <section className="h-screen">
      <Canvas shadows>
        <color attach="background" args={["black"]} />
        <hemisphereLight intensity={0.3} groundColor="black" />
        <spotLight
          position={[5, 8, 5]}
          intensity={100}
          castShadow
          angle={0.2}
          penumbra={1}
          color="white"
        />

        <group>
          <Computer />
          <mesh receiveShadow rotation={[MathUtils.degToRad(-90), 0, 0]}>
            <planeGeometry args={[40, 40]} />
            <MeshReflectorMaterial
              color="#111"
              mirror={0}
              resolution={2048}
              blur={[300, 150]}
              mixBlur={1}
              mixStrength={200}
              depthScale={1.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.3}
            />
          </mesh>
        </group>

        <EffectComposer disableNormalPass>
          <Bloom
            luminanceThreshold={0}
            luminanceSmoothing={0.0}
            mipmapBlur
            intensity={10}
          />
        </EffectComposer>

        <CameraRig />

        <BakeShadows />
      </Canvas>
    </section>
  );
};

export default Scene;
