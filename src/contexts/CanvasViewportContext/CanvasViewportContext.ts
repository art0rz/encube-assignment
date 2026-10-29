import { createContext, useContext } from "react";

interface CanvasViewport {
  zoom: number;
}

export const CanvasViewportContext = createContext<CanvasViewport | null>(null);

export function useCanvasViewport() {
  const context = useContext(CanvasViewportContext);

  if (context === null) {
    throw new Error("useCanvasViewport must be used inside InfiniteCanvas");
  }

  return context;
}
