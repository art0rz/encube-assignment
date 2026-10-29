import { type PropsWithChildren } from "react";
import { CommentsContext } from "./CommentsContext.ts";
import { useCommentsReducer } from "./commentsReducer.ts";

export default function CommentsProvider({ children }: PropsWithChildren) {
  const comments = useCommentsReducer();

  return <CommentsContext value={comments}>{children}</CommentsContext>;
}
