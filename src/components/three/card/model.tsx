import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  type RapierRigidBody,
  RigidBody,
  type RigidBodyProps,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { type MeshLineGeometry } from "meshline";
import {
  CatmullRomCurve3,
  type Mesh,
  RepeatWrapping,
  Vector2,
  Vector3,
} from "three";
import { type GLTF } from "three-stdlib";

import { PlasticMaterial } from "src/components/three/card/materials";

useGLTF.preload("/card.glb");

const segmentProps: RigidBodyProps = {
  type: "dynamic",
  canSleep: true,
  colliders: false,
  angularDamping: 3,
  linearDamping: 2,
};

type GLTFResult = GLTF & {
  nodes: {
    holder: Mesh;
    image: Mesh;
    glass: Mesh;
    clip: Mesh;
  };
  materials: {};
};

const CardModel = () => {
  const { nodes } = useGLTF("/models/card.glb") as GLTFResult;

  const fabrictexture = useTexture("/images/fabric.jpg");
  const cardImage = useTexture("/images/image.jpeg");

  const [dragged, drag] = useState<boolean | Vector3>(false);
  const [hovered, hover] = useState(false);

  const [curve] = useState(
    () =>
      new CatmullRomCurve3(
        Array(4)
          .fill(undefined)
          .map(() => new Vector3()),
        undefined,
        "chordal",
      ),
  );

  const vec = new Vector3();
  const ang = new Vector3();
  const rot = new Vector3();
  const dir = new Vector3();

  const band = useRef<Mesh<MeshLineGeometry>>(null!);

  const fixedPoint = useRef<RapierRigidBody>(null!);
  const joinedPoint1 = useRef<RapierRigidBody>(null!);
  const joinedPoint2 = useRef<RapierRigidBody>(null!);
  const joinedPoint3 = useRef<RapierRigidBody>(null!);
  const cardPoint = useRef<RapierRigidBody>(null!);

  useRopeJoint(fixedPoint, joinedPoint1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(joinedPoint1, joinedPoint2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(joinedPoint2, joinedPoint3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(joinedPoint3, cardPoint, [
    [0, 0, 0],
    [0, 1.45, 0],
  ]);

  const { width, height } = useThree((state) => state.size);

  useFrame((state) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      [cardPoint, joinedPoint1, joinedPoint2, joinedPoint3].forEach((ref) =>
        ref.current?.wakeUp(),
      );

      if (dragged instanceof Vector3) {
        cardPoint.current.setNextKinematicTranslation({
          x: vec.x - dragged.x,
          y: vec.y - dragged.y,
          z: vec.z - dragged.z,
        });
      }
    }

    if (fixedPoint.current) {
      //캣멀롬커브를 계산
      curve.points[0].copy(joinedPoint3.current.translation());
      curve.points[1].copy(joinedPoint2.current.translation());
      curve.points[2].copy(joinedPoint1.current.translation());
      curve.points[3].copy(fixedPoint.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));

      //카드를 강제로 앞면을 보게함
      ang.copy(cardPoint.current.angvel());
      rot.copy(cardPoint.current.rotation());
      cardPoint.current.setAngvel(
        { x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z },
        false,
      );
    }
  });

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";

      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  return (
    <>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          resolution={new Vector2(width, height)}
          lineWidth={1}
          useMap={1}
          map={fabrictexture}
          map-wrapS={RepeatWrapping}
          map-wrapT={RepeatWrapping}
          repeat={new Vector2(0.7, 0.3)}
        />
      </mesh>

      <group position={[0, 4, 0]}>
        <RigidBody ref={fixedPoint} {...segmentProps} type="fixed" />

        <RigidBody position={[0.5, 0, 0]} ref={joinedPoint1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={joinedPoint2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={joinedPoint3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          ref={cardPoint}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider position={[0, -0.26, 0]} args={[0.82, 1.27, 0.01]} />
          <group scale={18} position={[0, 1.4, 0]}>
            <mesh
              name="clip"
              castShadow
              receiveShadow
              geometry={nodes.clip.geometry}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[0.799, 1, 1]}
            >
              <PlasticMaterial />
            </mesh>

            <group
              onPointerOver={() => hover(true)}
              onPointerOut={() => hover(false)}
              onPointerUp={(e) => {
                (e.target as HTMLElement).releasePointerCapture(e.pointerId);
                drag(false);
              }}
              onPointerDown={(e) => {
                (e.target as HTMLElement).setPointerCapture(e.pointerId);
                drag(
                  new Vector3()
                    .copy(e.point)
                    .sub(vec.copy(cardPoint.current.translation())),
                );
              }}
            >
              <mesh
                name="glass"
                castShadow
                receiveShadow
                geometry={nodes.glass.geometry}
                rotation={[Math.PI / 2, 0, 0]}
                scale={[0.883, 1.161, 0.882]}
              >
                <meshPhysicalMaterial
                  transmission={1}
                  roughness={0}
                  ior={1.5}
                  clearcoat={0.5}
                  clearcoatRoughness={0.1}
                  transparent
                />
              </mesh>

              <mesh
                name="holder"
                castShadow
                receiveShadow
                geometry={nodes.holder.geometry}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <PlasticMaterial />
              </mesh>

              <mesh
                name="image"
                castShadow
                receiveShadow
                geometry={nodes.image.geometry}
                rotation={[Math.PI / 2, 0, 0]}
                scale={[0.871, 0.878, 0.878]}
              >
                <meshBasicMaterial
                  map={cardImage}
                  map-wrapS={RepeatWrapping}
                  map-wrapT={RepeatWrapping}
                  map-repeat={new Vector2(1, -1)}
                  map-center={new Vector2(0, 0.5)}
                />
              </mesh>
            </group>
          </group>
        </RigidBody>
      </group>
    </>
  );
};

export default CardModel;
