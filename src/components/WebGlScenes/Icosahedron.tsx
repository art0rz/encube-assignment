export default function Icosahedron() {
  return (
    <mesh>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#10b981" flatShading />
    </mesh>
  );
}
