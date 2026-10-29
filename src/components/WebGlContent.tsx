import { Canvas } from "@react-three/fiber";
import { type PropsWithChildren, useEffect, useMemo, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import styled from "@emotion/styled";
import { debounce } from "lodash-es";
import { useCanvasViewport } from "../state/CanvasViewportContext/CanvasViewportContext.ts";

const Root = styled.div`
  width: 100%;
  height: 100%;
`;

export default function WebGlContent({ children }: PropsWithChildren) {
  const { zoom } = useCanvasViewport();
  const targetDpr = Math.min(4, Math.max(1, window.devicePixelRatio * zoom));
  const [dpr, setDpr] = useState(targetDpr);

  // Resizing the drawing buffer is expensive, so wait until zooming settles.
  const updateDpr = useMemo(() => debounce(setDpr, 200), []);

  useEffect(() => {
    updateDpr(targetDpr);
  }, [targetDpr, updateDpr]);

  useEffect(() => () => updateDpr.cancel(), [updateDpr]);

  return (
    <Root>
      <Canvas frameloop="demand" camera={{ position: [3, 2.5, 4], fov: 40 }} dpr={dpr}>
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
          enableZoom={false}
        />
      </Canvas>
    </Root>
  );
}
