import { createContext, useContext } from "react";
import { type useCommentsReducer } from "./commentsReducer.ts";

type CommentsContextValue = ReturnType<typeof useCommentsReducer>;

export const CommentsContext = createContext<CommentsContextValue | null>(null);

export function useComments() {
  const context = useContext(CommentsContext);

  if (context === null) {
    throw new Error("useComments must be used inside CommentsProvider");
  }

  return context;
}
