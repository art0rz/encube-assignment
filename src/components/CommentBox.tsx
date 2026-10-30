import { useComments } from "../state/CommentsContext/CommentsContext.ts";
import type { CommentMessage } from "../state/CommentsContext/commentsReducer.ts";
import { useState } from "react";
import styled from "@emotion/styled";
import { Pencil, Reply } from "lucide-react";

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

const HeaderButton = styled.button`
  background: transparent;
  border: 1px solid #dadada;
  padding: 4px;
  width: 24px;
  height: 24px;
  cursor: pointer;

  > svg {
    width: 16px;
    height: 16px;
  }
`;

const Timestamp = styled.span`
  color: #545454;
`;

export default function CommentBox({ threadId }: { threadId: string }) {
  const { threads } = useComments();
  const thread = threads.find((thread) => thread.id === threadId);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const onReplyClick = (messageId: string | null) => {
    setEditingMessageId(null);
    setReplyTo(messageId);
  };

  const onEditClick = (messageId: string) => {
    setReplyTo(null);
    setEditingMessageId(messageId);
  };

  const onSubmitted = () => {
    setReplyTo(null);
    setEditingMessageId(null);
  };

  if (!thread) return null;

  return (
    <>
      <CommentMessages
        threadId={threadId}
        messages={thread.messages}
        parentId={null}
        replyTo={replyTo}
        editingMessageId={editingMessageId}
        onReplyClick={onReplyClick}
        onEditClick={onEditClick}
        onSubmitted={onSubmitted}
      />
      {replyTo === null && editingMessageId === null && <CommentForm threadId={threadId} />}
    </>
  );
}

interface CommentFormProps {
  parentId?: string | null;
  onSubmitted?: () => unknown;
  threadId: string;
  editingMessageId?: string;
  initialText?: string;
}

function CommentForm({
  threadId,
  editingMessageId,
  parentId = null,
  onSubmitted,
  initialText,
}: CommentFormProps) {
  const { addReply, editMessage } = useComments();
  const isEditing = editingMessageId !== undefined;
  const label = isEditing ? "Edit comment" : "Reply";

  const submitReply = (formData: FormData) => {
    const text = formData.get("text");

    if (typeof text !== "string" || !text.trim()) return;

    if (isEditing) {
      editMessage(threadId, editingMessageId, text);
    } else {
      addReply(threadId, text, parentId);
    }

    onSubmitted?.();
  };

  return (
    <form action={submitReply}>
      <input
        name="text"
        required
        placeholder={label}
        aria-label={label}
        defaultValue={initialText}
        autoFocus
      />

      <button type="submit">{isEditing ? "Save" : "Post"}</button>
    </form>
  );
}

type CommentMessagesProps = {
  threadId: string;
  messages: CommentMessage[];
  parentId: string | null;
  replyTo: string | null;
  editingMessageId: string | null;
  onReplyClick: (messageId: string | null) => unknown;
  onEditClick: (messageId: string) => unknown;
  onSubmitted: () => unknown;
};

function CommentMessages({
  threadId,
  messages,
  parentId,
  replyTo,
  editingMessageId,
  onReplyClick,
  onEditClick,
  onSubmitted,
}: CommentMessagesProps) {
  return messages
    .filter((message) => message.parentId === parentId)
    .map((message) => (
      <div key={message.id}>
        <ReplyHeader>
          <strong>{message.author}</strong>

          <Timestamp>{dateFormatter.format(new Date(message.createdAt))}</Timestamp>

          <HeaderButton type="button" onClick={() => onEditClick(message.id)}>
            <Pencil />
          </HeaderButton>

          <HeaderButton
            type="button"
            onClick={() => onReplyClick(replyTo === message.id ? null : message.id)}
          >
            <Reply />
          </HeaderButton>
        </ReplyHeader>

        {editingMessageId === message.id ? (
          <CommentForm
            key={message.id}
            threadId={threadId}
            editingMessageId={message.id}
            initialText={message.text}
            onSubmitted={onSubmitted}
          />
        ) : (
          <ReplyMessage>{message.text}</ReplyMessage>
        )}

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
              editingMessageId={editingMessageId}
              onEditClick={onEditClick}
              replyTo={replyTo}
              onReplyClick={onReplyClick}
              onSubmitted={onSubmitted}
            />
          </blockquote>
        )}
      </div>
    ));
}
