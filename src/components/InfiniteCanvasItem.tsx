import { type PropsWithChildren, useRef, useState } from "react";
import styled from "@emotion/styled";
import * as React from "react";

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
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
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
  const [position, setPosition] = useState<{ x: number; y: number }>({ x, y });
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const previous = dragStart.current;
    if (!previous) return;

    const dx = event.clientX - previous.x;
    const dy = event.clientY - previous.y;

    // Save the pointer position for the next movement.
    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
    };

    setPosition((position) => ({
      x: position.x + dx,
      y: position.y + dy,
    }));
  };

  const endDrag = () => {
    dragStart.current = null;
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    endDrag();

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <Root style={{ transform: `translate(${position.x}px,${position.y}px) scale(${zoom}) ` }}>
      <Title
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
      >
        Title
      </Title>
      <Content>{children}</Content>
    </Root>
  );
}
