import { type PropsWithChildren, useRef } from "react";
import styled from "@emotion/styled";
import * as React from "react";
import { useCanvasViewport } from "../state/CanvasViewportContext/CanvasViewportContext.ts";
import { type Point } from "../types/Point.ts";
import { useCanvasItems } from "../state/CanvasItemsContext/CanvasItemsContext.ts";
import { isDrag } from "../utils/isDrag.ts";

const TITLE_HEIGHT = 24;

const Root = styled.div`
  --padding-x: 4px;

  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  background: #fff;
`;

const Title = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: ${TITLE_HEIGHT}px;
  box-sizing: border-box;
  border-bottom: 1px solid #dadada;
  padding: 0 var(--padding-x);
  line-height: ${TITLE_HEIGHT - 1}px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transform-origin: 0 0;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const Content = styled.div`
  position: absolute;
  left: 0;
  padding: 0 var(--padding-x);
  width: 100%;
  box-sizing: border-box;
`;

interface InfiniteCanvasItemProps {
  id: string;
  title: string;
  // Called with the clicked point relative to the content's top-left corner, in canvas units.
  onContentClick?: (point: Point) => unknown;
}

export default function InfiniteCanvasItem({
  children,
  id,
  title,
  onContentClick,
}: PropsWithChildren<InfiniteCanvasItemProps>) {
  const { zoom } = useCanvasViewport();
  const { items, moveItem, raiseItem, zIndexOf } = useCanvasItems();
  const { x, y, width, height } = items[id];
  const contentRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<Point | null>(null);
  const contentPress = useRef<Point | null>(null);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const previous = dragStart.current;
    if (!previous) return;

    // Save the pointer position for the next movement.
    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
    };

    moveItem(id, (event.clientX - previous.x) / zoom, (event.clientY - previous.y) / zoom);
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

  const onContentPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    contentPress.current = { x: event.clientX, y: event.clientY };
  };

  const onContentClickEvent = (event: React.MouseEvent<HTMLDivElement>) => {
    const press = contentPress.current;
    const bounds = contentRef.current?.getBoundingClientRect();

    // Dragging inside the content, such as rotating a 3D model, isn't a click.
    if (!press || !bounds || isDrag(press, { x: event.clientX, y: event.clientY })) return;

    onContentClick?.({
      x: (event.clientX - bounds.left) / zoom,
      y: (event.clientY - bounds.top) / zoom,
    });
  };

  // The item's position and size describe its content, which zooms with the canvas. The
  // chrome (title bar, border, shadow) is scaled back down so it keeps its on-screen size.
  const chromeScale = 1 / zoom;
  const titleHeight = TITLE_HEIGHT * chromeScale;

  return (
    <Root
      style={{
        transform: `translate(${x}px,${y - titleHeight}px)`,
        width: `${width}px`,
        height: `${height + titleHeight}px`,
        zIndex: zIndexOf(id),
        borderRadius: `${6 * chromeScale}px`,
        // A spread shadow draws the border without taking up space inside the item.
        boxShadow: [
          `0 0 0 ${chromeScale}px #dadada`,
          `${3 * chromeScale}px ${3 * chromeScale}px ${10 * chromeScale}px rgba(0, 0, 0, 0.1)`,
        ].join(", "),
      }}
      onPointerDownCapture={() => raiseItem(id)}
    >
      <Title
        style={{
          width: `${width / chromeScale}px`,
          transform: `scale(${chromeScale})`,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
      >
        {title}
      </Title>
      <Content
        ref={contentRef}
        style={{ top: `${titleHeight}px`, height: `${height}px` }}
        onPointerDown={onContentPointerDown}
        onClick={onContentClickEvent}
      >
        {children}
      </Content>
    </Root>
  );
}
