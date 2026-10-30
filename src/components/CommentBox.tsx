import { useComments } from "../state/CommentsContext/CommentsContext.ts";
import type { CommentMessage } from "../state/CommentsContext/commentsReducer.ts";
import { useState } from "react";
import styled from "@emotion/styled";
import { Reply } from "lucide-react";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const ReplyHeader = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 6px 4px 0 0;

  > strong {
    flex: 1 0 auto;
  }
`;

const ReplyMessage = styled.p`
  margin: 2px 0;
`;

const ReplyButton = styled.button`
  background: transparent;
  border: 1px solid #dadada;
  padding: 4px;
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const ReplyIcon = styled(Reply)`
  width: 16px;
  height: 16px;
`;

const Timestamp = styled.span`
  color: #545454;
`;
export default function CommentBox({ threadId }: { threadId: string }) {
  const { threads } = useComments();
  const thread = threads.find((thread) => thread.id === threadId);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  if (!thread) return null;

  return (
    <>
      <CommentMessages
        threadId={threadId}
        messages={thread.messages}
        parentId={null}
        replyTo={replyTo}
        onReplyClick={setReplyTo}
        onSubmitted={() => setReplyTo(null)}
      />

      {replyTo === null && <CommentForm threadId={threadId} />}
    </>
  );
}

function CommentForm({
  threadId,
  parentId = null,
  onSubmitted,
}: {
  threadId: string;
  parentId?: string | null;
  onSubmitted?: () => unknown;
}) {
  const { addReply } = useComments();

  const submitReply = (formData: FormData) => {
    const text = formData.get("text");

    if (typeof text !== "string" || !text.trim()) return;

    addReply(threadId, text, parentId);
    onSubmitted?.();
  };

  return (
    <form action={submitReply}>
      <input name="text" required placeholder="Reply" autoFocus />
      <button type="submit">Post</button>
    </form>
  );
}

type CommentMessagesProps = {
  threadId: string;
  messages: CommentMessage[];
  parentId: string | null;
  replyTo: string | null;
  onReplyClick: (messageId: string | null) => unknown;
  onSubmitted: () => unknown;
};

function CommentMessages({
  threadId,
  messages,
  parentId,
  replyTo,
  onReplyClick,
  onSubmitted,
}: CommentMessagesProps) {
  return messages
    .filter((message) => message.parentId === parentId)
    .map((message) => (
      <div key={message.id}>
        <ReplyHeader>
          <strong>{message.author}</strong>

          <Timestamp>{dateFormatter.format(new Date(message.createdAt))}</Timestamp>

          <ReplyButton onClick={() => onReplyClick(replyTo === message.id ? null : message.id)}>
            <ReplyIcon />
          </ReplyButton>
        </ReplyHeader>

        <ReplyMessage>{message.text}</ReplyMessage>

        {replyTo === message.id && (
          <blockquote>
            <CommentForm threadId={threadId} parentId={message.id} onSubmitted={onSubmitted} />
          </blockquote>
        )}

        {messages.some((reply) => reply.parentId === message.id) && (
          <blockquote>
            <CommentMessages
              threadId={threadId}
              messages={messages}
              parentId={message.id}
              replyTo={replyTo}
              onReplyClick={onReplyClick}
              onSubmitted={onSubmitted}
            />
          </blockquote>
        )}
      </div>
    ));
}
