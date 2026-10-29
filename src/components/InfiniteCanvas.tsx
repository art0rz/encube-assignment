import { Children, type PropsWithChildren, useState } from "react";
import InfiniteCanvasItem from "./InfiniteCanvasItem.tsx";
import styled from "@emotion/styled";
import * as React from "react";

const Root = styled.div`
  background-image:
    linear-gradient(to right, white 9px, transparent 9px),
    linear-gradient(to bottom, white 9px, #666666 9px);
  background-size: 10px 10px;
  background-repeat: repeat;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
`;

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
  const [zoom, setZoom] = useState<number>(1);
  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const direction = Math.sign(event.deltaY);

    setZoom((previous) => Math.min(5, Math.max(0.1, previous - direction * 0.1)));
  };

  return (
    <Root onWheel={onWheel}>
      {Children.map(children, (child) => (
        <InfiniteCanvasItem zoom={zoom} x={100} y={100}>
          {child}
        </InfiniteCanvasItem>
      ))}
      <StatusBar>
        <div>Scale: {zoom}</div>
      </StatusBar>
    </Root>
  );
}
