import { type Point } from "../types/Point.ts";

// Pointer movement under this distance still counts as a click, so a slightly shaky click
// doesn't turn into a drag.
const dragThreshold = 4;

export function isDrag(start: Point, end: Point) {
  return Math.hypot(end.x - start.x, end.y - start.y) > dragThreshold;
}
