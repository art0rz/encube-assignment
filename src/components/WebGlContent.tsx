import { Canvas } from "@react-three/fiber";
import type { PropsWithChildren } from "react";
import { OrbitControls } from "@react-three/drei";
import styled from "@emotion/styled";

const Root = styled.div`
  width: 100%;
  height: 100%;
`;

export default function WebGlContent({ children }: PropsWithChildren) {
  return (
    <Root
      onPointerDown={(event) => event.stopPropagation()}
      onWheel={(event) => event.stopPropagation()}
    >
      <Canvas frameloop="demand" camera={{ position: [3, 2.5, 4], fov: 40 }}>
        {children}

        <ambientLight intensity={0.6} />

        <directionalLight position={[4, 6, 3]} intensity={3} />
        <directionalLight position={[-3, 2, -2]} intensity={1.5} color="#a5b4fc" />

        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
    </Root>
  );
}
