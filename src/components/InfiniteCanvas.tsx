import { Children, type PropsWithChildren, useRef, useState } from "react";
import InfiniteCanvasItem from "./InfiniteCanvasItem.tsx";
import styled from "@emotion/styled";
import * as React from "react";
import { css } from "@emotion/react";

const Root = styled.div(
  ({ x, y }: { x: number; y: number }) => css`
    background-image:
      linear-gradient(to right, white 9px, transparent 9px),
      linear-gradient(to bottom, white 9px, #b7b7b7 9px);
    background-size: 10px 10px;
    background-position: ${x}px ${y}px;
    background-repeat: repeat;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;

    &:active {
      cursor: grabbing;
    }
  `,
);

const StatusBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #dadada;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 4px 8px;
  font-size: 12px;
`;

export default function InfiniteCanvas({ children }: PropsWithChildren<{}>) {
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const [zoom, setZoom] = useState<number>(1);
  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const direction = Math.sign(event.deltaY);

    setZoom((previous) => Math.min(5, Math.max(0.1, previous - direction * 0.1)));
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.button !== 0) {
      return;
    }

    drag.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;

    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;

    drag.current = { x: event.clientX, y: event.clientY };

    setPan((previous) => ({
      x: previous.x + dx,
      y: previous.y + dy,
    }));
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <Root
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        drag.current = null;
      }}
      x={pan.x}
      y={pan.y}
    >
      {Children.map(children, (child) => (
        <InfiniteCanvasItem zoom={zoom} x={100 + pan.x} y={100 + pan.y}>
          {child}
        </InfiniteCanvasItem>
      ))}
      <StatusBar>
        <div>Scale: {zoom}</div>
      </StatusBar>
    </Root>
  );
}
