import { useComments } from "../state/CommentsContext/CommentsContext.ts";
import type { CommentMessage } from "../state/CommentsContext/commentsReducer.ts";
import { memo } from "react";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function CommentBox({ threadId }: { threadId: string }) {
  const { threads, addReply } = useComments();
  const thread = threads.find((thread) => thread.id === threadId);

  if (!thread) return null;

  const submitReply = (formData: FormData) => {
    const text = formData.get("text");

    if (typeof text !== "string" || !text.trim()) return;

    addReply(threadId, text);
  };

  return (
    <>
      <CommentMessages messages={thread.messages} />

      <form action={submitReply}>
        <input name="text" required />
      </form>
    </>
  );
}

const CommentMessages = memo(function CommentMessages({
  messages,
}: {
  messages: CommentMessage[];
}) {
  return messages.map((message) => (
    <div key={message.id}>
      <strong>
        {message.author} @ {dateFormatter.format(new Date(message.createdAt))}
      </strong>
      <p>{message.text}</p>
    </div>
  ));
});
