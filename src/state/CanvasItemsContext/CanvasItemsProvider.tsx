import { type PropsWithChildren } from "react";
import { CanvasItemsContext } from "./CanvasItemsContext.ts";
import { type CanvasItemLayout, useCanvasItemsReducer } from "./canvasItemsReducer.ts";

export default function CanvasItemsProvider({
  initialItems,
  children,
}: PropsWithChildren<{ initialItems: CanvasItemLayout[] }>) {
  const items = useCanvasItemsReducer(initialItems);

  return <CanvasItemsContext value={items}>{children}</CanvasItemsContext>;
}
