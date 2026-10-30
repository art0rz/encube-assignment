import { type PropsWithChildren } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { CanvasViewportContext } from "../../state/CanvasViewportContext/CanvasViewportContext.ts";
import useInfiniteCanvasEvents from "./useInfiniteCanvasEvents.ts";
import { type Point } from "../../types/Point.ts";
import { useComments } from "../../state/CommentsContext/CommentsContext.ts";

const Root = styled.div(
  ({ x, y }: Point) => css`
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

const World = styled.div`
  position: absolute;
  inset: 0;
  transform-origin: 0 0;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
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

export default function InfiniteCanvas({ children }: PropsWithChildren) {
  const comments = useComments();

  const onCanvasClick = (point: Point) => {
    comments.startDraft(point);
  };

  const {
    viewport: { pan, zoom },
    events,
  } = useInfiniteCanvasEvents({ onCanvasClick });

  return (
    <CanvasViewportContext value={{ zoom }}>
      <Root x={pan.x} y={pan.y} {...events}>
        <World
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          {children}
        </World>
        <StatusBar>
          <div>Zoom: {Math.round(zoom * 100)}%</div>
        </StatusBar>
      </Root>
    </CanvasViewportContext>
  );
}
