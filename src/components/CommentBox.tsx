import { useComments } from "../state/CommentsContext/CommentsContext.ts";
import type { CommentThread } from "../state/CommentsContext/commentsReducer.ts";
import { createContext, useContext, useState } from "react";
import styled from "@emotion/styled";
import { Pencil, Reply } from "lucide-react";
import CommentForm from "./CommentForm.tsx";
import { formatTimestamp } from "../utils/formatTimestamp.ts";

const Message = styled.div`
  padding-top: 10px;
`;

const Avatar = styled.span`
  display: grid;
  place-items: center;
  flex: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 600;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 24px;

  > strong {
    font-size: 13px;
    white-space: nowrap;
  }
`;

const Timestamp = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: #6b7280;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const IconButton = styled.button`
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #6b7280;
  cursor: pointer;

  &:hover,
  &[aria-pressed="true"] {
    background: #f3f4f6;
    color: #111827;
  }

  > svg {
    width: 14px;
    height: 14px;
  }
`;

const MessageText = styled.p`
  margin: 2px 0 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

// The guide line runs under the centre of the parent's avatar.
const Replies = styled.div`
  margin-left: 11px;
  padding-left: 10px;
  border-left: 2px solid #e5e7eb;
`;

interface ThreadContextValue {
  thread: CommentThread;
  replyTo: string | null;
  editingMessageId: string | null;
  onReplyClick: (messageId: string | null) => unknown;
  onEditClick: (messageId: string) => unknown;
  onSubmitted: () => unknown;
}

// Shares the reply/edit state of one thread with its recursively rendered messages.
const ThreadContext = createContext<ThreadContextValue | null>(null);

function useThread() {
  const context = useContext(ThreadContext);

  if (context === null) {
    throw new Error("useThread must be used inside CommentBox");
  }

  return context;
}

export default function CommentBox({ threadId }: { threadId: string }) {
  const { threads, addReply } = useComments();
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
    <ThreadContext
      value={{ thread, replyTo, editingMessageId, onReplyClick, onEditClick, onSubmitted }}
    >
      <CommentMessages parentId={null} />
      {replyTo === null && editingMessageId === null && (
        <CommentForm
          label="Reply"
          submitLabel="Post"
          onSubmit={(text) => addReply(threadId, text)}
        />
      )}
    </ThreadContext>
  );
}

function CommentMessages({ parentId }: { parentId: string | null }) {
  const { addReply, editMessage } = useComments();
  const { thread, replyTo, editingMessageId, onReplyClick, onEditClick, onSubmitted } = useThread();
  const { messages } = thread;

  return messages
    .filter((message) => message.parentId === parentId)
    .map((message) => (
      <Message key={message.id}>
        <MessageHeader>
          <Avatar aria-hidden>{message.author.charAt(0)}</Avatar>

          <strong>{message.author}</strong>

          <Timestamp>{formatTimestamp(message.createdAt)}</Timestamp>

          <IconButton
            type="button"
            aria-label="Edit"
            aria-pressed={editingMessageId === message.id}
            onClick={() => onEditClick(message.id)}
          >
            <Pencil />
          </IconButton>

          <IconButton
            type="button"
            aria-label="Reply"
            aria-pressed={replyTo === message.id}
            onClick={() => onReplyClick(replyTo === message.id ? null : message.id)}
          >
            <Reply />
          </IconButton>
        </MessageHeader>

        {editingMessageId === message.id ? (
          <CommentForm
            key={message.id}
            label="Edit comment"
            submitLabel="Save"
            initialText={message.text}
            onSubmit={(text) => {
              editMessage(thread.id, message.id, text);
              onSubmitted();
            }}
          />
        ) : (
          <MessageText>{message.text}</MessageText>
        )}

        {replyTo === message.id && (
          <Replies>
            <CommentForm
              label="Reply"
              submitLabel="Post"
              onSubmit={(text) => {
                addReply(thread.id, text, message.id);
                onSubmitted();
              }}
            />
          </Replies>
        )}

        {messages.some((reply) => reply.parentId === message.id) && (
          <Replies>
            <CommentMessages parentId={message.id} />
          </Replies>
        )}
      </Message>
    ));
}
