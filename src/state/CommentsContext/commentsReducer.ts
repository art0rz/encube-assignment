import { useReducer } from "react";
import { type Point } from "../../types/Point.ts";
import { seedThreads } from "./seedThreads.ts";

// Where a thread is pinned: relative to an item's top-left corner so it moves with the item,
// or directly in canvas coordinates when itemId is null.
export interface ThreadAnchor extends Point {
  itemId: string | null;
}

export interface CommentThread extends ThreadAnchor {
  id: string;
  resolved: boolean;
  messages: CommentMessage[];
}

export interface CommentMessage {
  id: string;
  parentId: string | null;
  author: string;
  text: string;
  createdAt: string;
}

export interface CommentsState {
  threads: CommentThread[];
  selectedThreadId: string | null;
  // Where a new thread will be placed once its first message is posted.
  draft: ThreadAnchor | null;
}

const initialState: CommentsState = {
  threads: seedThreads,
  selectedThreadId: null,
  draft: null,
};

type CommentsAction =
  | {
      type: "threadAdded";
      thread: CommentThread;
    }
  | {
      type: "replyAdded";
      threadId: string;
      message: CommentMessage;
    }
  | {
      type: "messageEdited";
      threadId: string;
      messageId: string;
      text: string;
    }
  | {
      type: "threadResolved";
      threadId: string;
      resolved: boolean;
    }
  | {
      type: "threadSelected";
      threadId: string | null;
    }
  | {
      type: "draftStarted";
      anchor: ThreadAnchor;
    };

function commentsReducer(state: CommentsState, action: CommentsAction): CommentsState {
  switch (action.type) {
    case "threadAdded":
      return {
        ...state,
        threads: [...state.threads, action.thread],
        selectedThreadId: action.thread.id,
        draft: null,
      };

    case "replyAdded":
      return {
        ...state,
        threads: state.threads.map((thread) =>
          thread.id === action.threadId
            ? {
                ...thread,
                messages: [...thread.messages, action.message],
              }
            : thread,
        ),
      };

    case "messageEdited":
      return {
        ...state,
        threads: state.threads.map((thread) =>
          thread.id === action.threadId
            ? {
                ...thread,
                messages: thread.messages.map((message) =>
                  message.id === action.messageId ? { ...message, text: action.text } : message,
                ),
              }
            : thread,
        ),
      };

    case "threadResolved":
      return {
        ...state,
        threads: state.threads.map((thread) =>
          thread.id === action.threadId ? { ...thread, resolved: action.resolved } : thread,
        ),
      };

    case "threadSelected":
      return {
        ...state,
        selectedThreadId: action.threadId,
        draft: null,
      };

    case "draftStarted":
      return {
        ...state,
        selectedThreadId: null,
        draft: action.anchor,
      };
  }
}

export function useCommentsReducer() {
  const [state, dispatch] = useReducer(commentsReducer, initialState);

  function createMessage(text: string, parentId: string | null = null): CommentMessage {
    return {
      id: crypto.randomUUID(),
      parentId,
      author: "You",
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
  }

  function addThread(anchor: ThreadAnchor, text: string) {
    if (!text.trim()) return;

    const thread: CommentThread = {
      ...anchor,
      id: crypto.randomUUID(),
      resolved: false,
      messages: [createMessage(text)],
    };

    dispatch({ type: "threadAdded", thread });

    return thread.id;
  }

  function addReply(threadId: string, text: string, parentId: string | null = null) {
    if (!text.trim()) return;

    dispatch({
      type: "replyAdded",
      threadId,
      message: createMessage(text, parentId),
    });
  }

  function editMessage(threadId: string, messageId: string, text: string) {
    if (!text.trim()) return;

    dispatch({
      type: "messageEdited",
      threadId,
      messageId,
      text: text.trim(),
    });
  }

  function setResolved(threadId: string, resolved: boolean) {
    dispatch({
      type: "threadResolved",
      threadId,
      resolved,
    });
  }

  function selectThread(threadId: string | null) {
    dispatch({ type: "threadSelected", threadId });
  }

  function startDraft(anchor: ThreadAnchor) {
    dispatch({ type: "draftStarted", anchor });
  }

  return {
    threads: state.threads,
    selectedThreadId: state.selectedThreadId,
    draft: state.draft,
    addThread,
    addReply,
    editMessage,
    setResolved,
    selectThread,
    startDraft,
  };
}
