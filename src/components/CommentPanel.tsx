import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { ArrowLeft, Check, MessageSquare, RotateCcw, X } from "lucide-react";
import { useComments } from "../state/CommentsContext/CommentsContext.ts";
import CommentBox from "./CommentBox.tsx";
import CommentForm from "./CommentForm.tsx";
import CommentList, { type CommentFilter } from "./CommentList.tsx";

const Root = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 320px;
  max-width: 100vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #dadada;
  background: #fff;
  box-shadow: -3px 0 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-bottom: 1px solid #dadada;

  > h2 {
    flex: 1;
    margin: 0;
    font-size: 14px;
  }
`;

const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 12px;
`;

const IconButton = styled.button`
  display: grid;
  place-items: center;
  padding: 4px;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
  }

  > svg {
    width: 16px;
    height: 16px;
  }
`;

const TextButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: 1px solid #dadada;
  border-radius: 6px;
  background: #fff;
  font: inherit;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
  }

  > svg {
    width: 14px;
    height: 14px;
  }
`;

const OpenButton = styled(TextButton)`
  position: fixed;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
`;

export default function CommentPanel() {
  const { threads, selectedThreadId, draft, addThread, selectThread, setResolved } = useComments();
  const [isListOpen, setIsListOpen] = useState(false);
  const [filter, setFilter] = useState<CommentFilter>("open");
  const thread = threads.find((thread) => thread.id === selectedThreadId);
  const isOpen = draft !== null || thread !== undefined || isListOpen;

  const close = () => {
    selectThread(null);
    setIsListOpen(false);
  };

  const showList = () => {
    selectThread(null);
    setIsListOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (!isOpen) {
    return (
      <OpenButton type="button" onClick={showList}>
        <MessageSquare />
        Threads ({threads.filter((thread) => !thread.resolved).length})
      </OpenButton>
    );
  }

  return (
    <Root aria-label="Threads">
      <Header>
        {thread && (
          <IconButton type="button" aria-label="All threads" onClick={showList}>
            <ArrowLeft />
          </IconButton>
        )}

        <h2>
          {thread ? `Thread ${threads.indexOf(thread) + 1}` : draft ? "New thread" : "Threads"}
        </h2>

        {thread && (
          <TextButton type="button" onClick={() => setResolved(thread.id, !thread.resolved)}>
            {thread.resolved ? <RotateCcw /> : <Check />}
            {thread.resolved ? "Reopen" : "Resolve"}
          </TextButton>
        )}

        <IconButton type="button" aria-label="Close" onClick={close}>
          <X />
        </IconButton>
      </Header>

      <Body>
        {thread ? (
          <CommentBox key={thread.id} threadId={thread.id} />
        ) : draft ? (
          <CommentForm
            label="Add a comment"
            submitLabel="Post"
            onSubmit={(text) => addThread(draft, text)}
          />
        ) : (
          <CommentList filter={filter} onFilterChange={setFilter} />
        )}
      </Body>
    </Root>
  );
}
