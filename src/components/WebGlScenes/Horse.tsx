import { Center, Clone, useGLTF } from "@react-three/drei";
import horse from "../../assets/horse.glb?url";

export default function Horse() {
  const { scene } = useGLTF(horse);

  return (
    <Center>
      <Clone object={scene} scale={0.01} />
    </Center>
  );
}
