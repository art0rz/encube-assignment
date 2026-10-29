import { RoundedBox } from "@react-three/drei";

export default function Cube() {
  return (
    <RoundedBox args={[1.5, 1.5, 1.5]} radius={0.08} smoothness={4}>
      <meshStandardMaterial color="#f1e963" roughness={0.3} metalness={0.2} />
    </RoundedBox>
  );
}
