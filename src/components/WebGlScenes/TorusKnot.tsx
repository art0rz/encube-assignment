export default function TorusKnot() {
  return (
    <mesh>
      <torusKnotGeometry args={[0.6, 0.2, 100, 16]} />
      <meshStandardMaterial color="#6366f1" roughness={0.3} />
    </mesh>
  );
}
