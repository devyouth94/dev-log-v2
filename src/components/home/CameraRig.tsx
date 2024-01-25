import { useFrame } from "@react-three/fiber";
import { easing } from "maath";

const CameraRig = () => {
  return useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [
        2 + (state.pointer.x * state.viewport.width) / 10,
        (6 + state.pointer.y) / 2,
        7,
      ],
      0.3,
      delta,
    );

    state.camera.lookAt(0, 0, 0);
  });
};

export default CameraRig;
