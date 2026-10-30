import { useEffect } from "react";
import styled from "@emotion/styled";
import { X } from "lucide-react";
import { useComments } from "../state/CommentsContext/CommentsContext.ts";
import CommentBox from "./CommentBox.tsx";
import CommentForm from "./CommentForm.tsx";

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
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid #dadada;

  > h2 {
    margin: 0;
    font-size: 14px;
  }
`;

const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 12px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;

  > svg {
    display: block;
    width: 16px;
    height: 16px;
  }
`;

export default function CommentPanel() {
  const { threads, selectedThreadId, draft, addThread, selectThread } = useComments();
  const thread = threads.find((thread) => thread.id === selectedThreadId);
  const isOpen = draft !== null || thread !== undefined;

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") selectThread(null);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, selectThread]);

  if (!isOpen) return null;

  return (
    <Root aria-label="Threads">
      <Header>
        <h2>{thread ? `Thread ${threads.indexOf(thread) + 1}` : "New thread"}</h2>
        <CloseButton type="button" aria-label="Close" onClick={() => selectThread(null)}>
          <X />
        </CloseButton>
      </Header>

      <Body>
        {thread ? (
          <CommentBox key={thread.id} threadId={thread.id} />
        ) : (
          draft && (
            <CommentForm
              label="Add a comment"
              submitLabel="Post"
              onSubmit={(text) => addThread(draft, text)}
            />
          )
        )}
      </Body>
    </Root>
  );
}
