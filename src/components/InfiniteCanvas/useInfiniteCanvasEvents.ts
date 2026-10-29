import { useRef, useState } from "react";
import * as React from "react";
import { type Point } from "../../types/Point.ts";

function useInfiniteCanvasEvents({ onCanvasClick }: { onCanvasClick: (point: Point) => unknown }) {
  const pointerStart = useRef<Point | null>(null);
  const drag = useRef<Point | null>(null);
  const didDrag = useRef(false);

  const [view, setView] = useState({
    pan: { x: 0, y: 0 },
    zoom: 1,
  });

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = event.clientX - bounds.left;
    const pointerY = event.clientY - bounds.top;

    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? bounds.height : 1;

    const delta = event.deltaY * unit;

    setView(({ pan, zoom }) => {
      const nextZoom = Math.min(5, Math.max(0.1, zoom * Math.exp(-delta * 0.002)));

      // Find the canvas coordinate currently beneath the cursor.
      const worldX = (pointerX - pan.x) / zoom;
      const worldY = (pointerY - pan.y) / zoom;

      // Keep that coordinate beneath the cursor after zooming.
      return {
        zoom: nextZoom,
        pan: {
          x: pointerX - worldX * nextZoom,
          y: pointerY - worldY * nextZoom,
        },
      };
    });
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.button !== 0) return;

    const point = { x: event.clientX, y: event.clientY };

    pointerStart.current = point;
    drag.current = point;
    didDrag.current = false;

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;

    const start = pointerStart.current;

    if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 4) {
      didDrag.current = true;
    }

    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;

    drag.current = { x: event.clientX, y: event.clientY };

    setView((previous) => ({
      ...previous,
      pan: {
        x: previous.pan.x + dx,
        y: previous.pan.y + dy,
      },
    }));
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    pointerStart.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onPointerCancel = () => {
    drag.current = null;
    pointerStart.current = null;
    didDrag.current = true;
  };

  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || didDrag.current) return;

    const bounds = event.currentTarget.getBoundingClientRect();

    onCanvasClick({
      x: (event.clientX - bounds.left - view.pan.x) / view.zoom,
      y: (event.clientY - bounds.top - view.pan.y) / view.zoom,
    });
  };

  return {
    viewport: view,
    events: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onWheel,
      onClick,
    },
  };
}

export default useInfiniteCanvasEvents;
