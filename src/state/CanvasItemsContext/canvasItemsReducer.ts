import { useReducer } from "react";

export interface CanvasItemLayout {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CanvasItemsState {
  items: Record<string, CanvasItemLayout>;
  // Item ids from back to front.
  order: string[];
}

type CanvasItemsAction =
  | {
      type: "itemMoved";
      id: string;
      dx: number;
      dy: number;
    }
  | {
      type: "itemRaised";
      id: string;
    };

function canvasItemsReducer(state: CanvasItemsState, action: CanvasItemsAction): CanvasItemsState {
  switch (action.type) {
    case "itemMoved": {
      const item = state.items[action.id];

      return {
        ...state,
        items: {
          ...state.items,
          [action.id]: { ...item, x: item.x + action.dx, y: item.y + action.dy },
        },
      };
    }

    case "itemRaised":
      if (state.order.at(-1) === action.id) return state;

      return {
        ...state,
        order: [...state.order.filter((id) => id !== action.id), action.id],
      };
  }
}

export function useCanvasItemsReducer(initialItems: CanvasItemLayout[]) {
  const [state, dispatch] = useReducer(canvasItemsReducer, initialItems, (items) => ({
    items: Object.fromEntries(items.map((item) => [item.id, item])),
    order: items.map((item) => item.id),
  }));

  function moveItem(id: string, dx: number, dy: number) {
    dispatch({ type: "itemMoved", id, dx, dy });
  }

  function raiseItem(id: string) {
    dispatch({ type: "itemRaised", id });
  }

  // The z-index for an item, or for something on the canvas itself (null), which sits
  // above every item.
  function zIndexOf(id: string | null) {
    return (id === null ? state.order.length : state.order.indexOf(id)) + 1;
  }

  return {
    items: state.items,
    moveItem,
    raiseItem,
    zIndexOf,
  };
}
