import type { PropsWithChildren } from "react";
import styled from "@emotion/styled";

const Root = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;

interface InfiniteCanvasItemProps {
  zoom: number;
}

export default function InfiniteCanvasItem({
  children,
  zoom,
}: PropsWithChildren<InfiniteCanvasItemProps>) {
  return (
    <Root style={{ transform: `scale(${zoom})` }}>
      <p>Title</p>
      {children}
    </Root>
  );
}
