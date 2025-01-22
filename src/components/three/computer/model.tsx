import React, { useRef } from "react";
import {
  PerspectiveCamera,
  RenderTexture,
  Text,
  useGLTF,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { type GLTF } from "three-stdlib";

useGLTF.preload("/mac.glb");

type GLTFResult = GLTF & {
  nodes: {
    screen: THREE.Mesh;
    monitor_front_1: THREE.Mesh;
    monitor_front_2: THREE.Mesh;
    light: THREE.Mesh;
    monitor_back_1: THREE.Mesh;
    monitor_back_2: THREE.Mesh;
    monitor_back_3: THREE.Mesh;
    monitor_back_4: THREE.Mesh;
    mouse_1: THREE.Mesh;
    mouse_2: THREE.Mesh;
    mouse_3: THREE.Mesh;
    mouse_4: THREE.Mesh;
    keyboard_1: THREE.Mesh;
    keyboard_2: THREE.Mesh;
    keyboard_3: THREE.Mesh;
    keyboard_4: THREE.Mesh;
    keyboard_5: THREE.Mesh;
    keyboard_6: THREE.Mesh;
    keyboard_7: THREE.Mesh;
  };
  materials: {
    hello: THREE.MeshStandardMaterial;
    hello_4: THREE.MeshStandardMaterial;
    black: THREE.MeshStandardMaterial;
    ["Material.002"]: THREE.MeshStandardMaterial;
    Macintosh_2: THREE.MeshStandardMaterial;
    ["Material.003"]: THREE.MeshStandardMaterial;
    ["Macintosh-128K-retro"]: THREE.MeshStandardMaterial;
    ["Material.011"]: THREE.MeshStandardMaterial;
    grey: THREE.MeshStandardMaterial;
    ["Material.009"]: THREE.MeshStandardMaterial;
    ["Apple-0"]: THREE.MeshStandardMaterial;
    ["Material.010"]: THREE.MeshStandardMaterial;
    klava_2_1: THREE.MeshStandardMaterial;
    ["Material.005"]: THREE.MeshStandardMaterial;
    klava_2: THREE.MeshStandardMaterial;
  };
};

const ComputerModel = () => {
  const { nodes, materials } = useGLTF("/models/mac.glb") as GLTFResult;

  const textRef = useRef<THREE.Mesh>(null!);

  useFrame(
    (state) =>
      (textRef.current.position.x =
        -1 + Math.sin(state.clock.elapsedTime / 2) * 8),
  );

  return (
    <group scale={4.5} rotation={[0, THREE.MathUtils.degToRad(-90), 0]}>
      <mesh
        name="screen"
        castShadow
        receiveShadow
        geometry={nodes.screen.geometry}
      >
        <meshBasicMaterial toneMapped={false}>
          <RenderTexture width={512} height={512} attach="map">
            <PerspectiveCamera
              makeDefault
              manual
              aspect={1 / 1.2}
              position={[0, 0, 25]}
            />
            <color attach="background" args={["#35c19f"]} />
            <ambientLight intensity={3} />
            <directionalLight position={[0, 0, 20]} />
            <Text
              ref={textRef}
              font="/fonts/RobotoMono-Bold.ttf"
              position={[4.5, 7, 0]}
              fontSize={4}
              letterSpacing={-0.05}
              color="black"
            >
              404error!
            </Text>
          </RenderTexture>
        </meshBasicMaterial>
      </mesh>
      <group name="monitor_front">
        <mesh
          name="monitor_front_1"
          castShadow
          receiveShadow
          geometry={nodes.monitor_front_1.geometry}
          material={materials.hello_4}
        />
        <mesh
          name="monitor_front_2"
          castShadow
          receiveShadow
          geometry={nodes.monitor_front_2.geometry}
          material={materials.black}
        />
      </group>
      <mesh
        name="light"
        castShadow
        receiveShadow
        geometry={nodes.light.geometry}
        material={materials["Material.002"]}
      />
      <group name="monitor_back">
        <mesh
          name="monitor_back_1"
          castShadow
          receiveShadow
          geometry={nodes.monitor_back_1.geometry}
          material={materials.Macintosh_2}
        />
        <mesh
          name="monitor_back_2"
          castShadow
          receiveShadow
          geometry={nodes.monitor_back_2.geometry}
          material={materials.hello_4}
        />
        <mesh
          name="monitor_back_3"
          castShadow
          receiveShadow
          geometry={nodes.monitor_back_3.geometry}
          material={materials["Material.003"]}
        />
        <mesh
          name="monitor_back_4"
          castShadow
          receiveShadow
          geometry={nodes.monitor_back_4.geometry}
          material={materials["Macintosh-128K-retro"]}
        />
      </group>
      <group name="mouse">
        <mesh
          name="mouse_1"
          castShadow
          receiveShadow
          geometry={nodes.mouse_1.geometry}
          material={materials["Material.011"]}
        />
        <mesh
          name="mouse_2"
          castShadow
          receiveShadow
          geometry={nodes.mouse_2.geometry}
          material={materials.grey}
        />
        <mesh
          name="mouse_3"
          castShadow
          receiveShadow
          geometry={nodes.mouse_3.geometry}
          material={materials["Material.009"]}
        />
        <mesh
          name="mouse_4"
          castShadow
          receiveShadow
          geometry={nodes.mouse_4.geometry}
          material={materials["Apple-0"]}
        />
      </group>
      <group name="keyboard">
        <mesh
          name="keyboard_1"
          castShadow
          receiveShadow
          geometry={nodes.keyboard_1.geometry}
          material={materials["Material.010"]}
        />
        <mesh
          name="keyboard_2"
          castShadow
          receiveShadow
          geometry={nodes.keyboard_2.geometry}
          material={materials.grey}
        />
        <mesh
          name="keyboard_3"
          castShadow
          receiveShadow
          geometry={nodes.keyboard_3.geometry}
          material={materials.klava_2_1}
        />
        <mesh
          name="keyboard_4"
          castShadow
          receiveShadow
          geometry={nodes.keyboard_4.geometry}
          material={materials["Material.005"]}
        />
        <mesh
          name="keyboard_5"
          castShadow
          receiveShadow
          geometry={nodes.keyboard_5.geometry}
          material={materials.klava_2}
        />
        <mesh
          name="keyboard_6"
          castShadow
          receiveShadow
          geometry={nodes.keyboard_6.geometry}
          material={materials.hello_4}
        />
        <mesh
          name="keyboard_7"
          castShadow
          receiveShadow
          geometry={nodes.keyboard_7.geometry}
          material={materials["Material.003"]}
        />
      </group>
    </group>
  );
};

export default ComputerModel;
