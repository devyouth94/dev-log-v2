import { useTexture } from "@react-three/drei";
import { type MeshPhysicalMaterialProps } from "@react-three/fiber";
import { RepeatWrapping, Vector2 } from "three";

export const PlasticMaterial = ({ ...props }: MeshPhysicalMaterialProps) => {
  const plasticNormal = useTexture("/images/plastic-normal.jpg");

  return (
    <meshPhysicalMaterial
      color="#4f4f4f"
      normalScale={new Vector2(0.3, 0.3)}
      normalMap={plasticNormal}
      normalMap-repeat={new Vector2(2, 2)}
      normalMap-wrapS={RepeatWrapping}
      normalMap-wrapT={RepeatWrapping}
      roughness={0.8}
      metalness={0.9}
      envMapIntensity={0.2}
      {...props}
    />
  );
};
