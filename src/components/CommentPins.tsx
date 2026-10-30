import styled from "@emotion/styled";
import { useComments } from "../state/CommentsContext/CommentsContext.ts";
import { useCanvasViewport } from "../state/CanvasViewportContext/CanvasViewportContext.ts";
import { useCanvasItems } from "../state/CanvasItemsContext/CanvasItemsContext.ts";
import { type ThreadAnchor } from "../state/CommentsContext/commentsReducer.ts";

const Pin = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0;
  width: 28px;
  height: 28px;
  margin: 0;
  padding: 0;
  border: 2px solid #fff;
  border-radius: 50% 50% 50% 0;
  background: #2563eb;
  color: #fff;
  font: 600 12px/1 var(--sans);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  cursor: pointer;

  &[data-resolved] {
    background: #9ca3af;
  }

  &[data-selected] {
    outline: 2px solid #1e3a8a;
    outline-offset: 1px;
  }

  &[data-draft] {
    border: 2px dashed #2563eb;
    background: #fff;
    color: #2563eb;
    cursor: default;
  }
`;

export default function CommentPins() {
  const { threads, selectedThreadId, draft, selectThread } = useComments();
  const { zoom } = useCanvasViewport();
  const { items, zIndexOf } = useCanvasItems();

  // Pins live in canvas coordinates but keep a constant on-screen size, with their tip
  // (bottom-left corner) on the commented point. Pins on an item follow it when it moves.
  const style = ({ itemId, x, y }: ThreadAnchor) => {
    const item = itemId === null ? undefined : items[itemId];
    const left = (item?.x ?? 0) + x;
    const top = (item?.y ?? 0) + y;

    return {
      transform: `translate(${left}px, ${top}px) scale(${1 / zoom}) translateY(-100%)`,
      // Pins share their item's z-index and come after the items in the DOM, so they sit
      // just above their own item but below any item raised over it.
      zIndex: zIndexOf(itemId),
    };
  };

  return (
    <>
      {threads.map((thread, index) => (
        <Pin
          key={thread.id}
          type="button"
          aria-label={`Open thread ${index + 1}`}
          data-selected={thread.id === selectedThreadId || undefined}
          data-resolved={thread.resolved || undefined}
          style={style(thread)}
          onClick={() => selectThread(thread.id)}
        >
          {index + 1}
        </Pin>
      ))}

      {draft && (
        <Pin as="div" aria-hidden data-draft style={style(draft)}>
          +
        </Pin>
      )}
    </>
  );
}
