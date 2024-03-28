import {
  BakeShadows,
  MeshReflectorMaterial,
  useProgress,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { MathUtils } from "three";

import CameraRig from "~/components/home/camera-rig";
import Model from "~/components/home/model";
import { Progress } from "~/components/ui/progress";

const Three = () => {
  const { progress } = useProgress();

  return (
    <main className="flex h-dvh items-center justify-center bg-black">
      {progress !== 100 ? (
        <div className="w-72">
          <Progress value={progress} />
        </div>
      ) : (
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
            <Model />
            <mesh
              receiveShadow
              rotation={[MathUtils.degToRad(-90), 0, 0]}
              position={[-25, 0, -25]}
            >
              <planeGeometry args={[100, 100]} />
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
      )}
    </main>
  );
};

export default Three;
