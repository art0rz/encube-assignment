import { createContext, useContext } from "react";
import { type useCanvasItemsReducer } from "./canvasItemsReducer.ts";

type CanvasItemsContextValue = ReturnType<typeof useCanvasItemsReducer>;

export const CanvasItemsContext = createContext<CanvasItemsContextValue | null>(null);

export function useCanvasItems() {
  const context = useContext(CanvasItemsContext);

  if (context === null) {
    throw new Error("useCanvasItems must be used inside CanvasItemsProvider");
  }

  return context;
}
