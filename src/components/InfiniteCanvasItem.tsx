import { type PropsWithChildren } from "react";
import styled from "@emotion/styled";

const Root = styled.div`
  --padding-x: 4px;

  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid #dadada;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.div`
  border-bottom: 1px solid #dadada;
  padding: 0 var(--padding-x);
`;

const Content = styled.div`
  padding: 0 var(--padding-x);
`;

interface InfiniteCanvasItemProps {
  zoom: number;
  x: number;
  y: number;
}

export default function InfiniteCanvasItem({
  children,
  zoom,
  x,
  y,
}: PropsWithChildren<InfiniteCanvasItemProps>) {
  return (
    <Root style={{ transform: `translate(${x}px,${y}px) scale(${zoom}) ` }}>
      <Title>Title</Title>
      <Content>{children}</Content>
    </Root>
  );
}
