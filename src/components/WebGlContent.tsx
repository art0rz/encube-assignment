import { Canvas } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";

export default function WebGlContent() {
  return (
    <div
      style={{ width: "100%", height: 320 }}
      onPointerDown={(event) => event.stopPropagation()}
      onWheel={(event) => event.stopPropagation()}
    >
      <Canvas frameloop="demand" camera={{ position: [3, 2.5, 4], fov: 40 }}>
        <ambientLight intensity={0.6} />

        <directionalLight position={[4, 6, 3]} intensity={3} />
        <directionalLight position={[-3, 2, -2]} intensity={1.5} color="#a5b4fc" />

        <RoundedBox args={[1.5, 1.5, 1.5]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color="#6366f1" roughness={0.3} metalness={0.2} />
        </RoundedBox>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
}
