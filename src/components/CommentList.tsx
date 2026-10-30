import styled from "@emotion/styled";
import { useComments } from "../state/CommentsContext/CommentsContext.ts";
import { formatTimestamp } from "../utils/formatTimestamp.ts";

export type CommentFilter = "open" | "resolved";

const Tabs = styled.div`
  display: flex;
  gap: 4px;
  padding: 10px 0;
`;

const Tab = styled.button`
  padding: 4px 10px;
  border: 1px solid #dadada;
  border-radius: 999px;
  background: #fff;
  color: #374151;
  font: inherit;
  font-size: 13px;
  cursor: pointer;

  &[aria-pressed="true"] {
    border-color: #2563eb;
    background: #2563eb;
    color: #fff;
  }
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Item = styled.button`
  display: grid;
  grid-template-columns: 24px 1fr;
  column-gap: 8px;
  width: 100%;
  padding: 10px 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
  }
`;

const Badge = styled.span`
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50% 50% 50% 0;
  background: #2563eb;
  color: #fff;
  font-size: 12px;
  font-weight: 600;

  &[data-resolved] {
    background: #9ca3af;
  }
`;

const Meta = styled.span`
  display: flex;
  gap: 6px;
  align-items: baseline;
  font-size: 12px;
  color: #6b7280;

  > strong {
    color: #111827;
    font-size: 13px;
  }
`;

const Excerpt = styled.span`
  display: -webkit-box;
  grid-column: 2;
  margin-top: 2px;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

const ReplyCount = styled.span`
  grid-column: 2;
  margin-top: 4px;
  color: #6b7280;
  font-size: 12px;
`;

const Empty = styled.p`
  color: #6b7280;
`;

interface CommentListProps {
  filter: CommentFilter;
  onFilterChange: (filter: CommentFilter) => unknown;
}

export default function CommentList({ filter, onFilterChange }: CommentListProps) {
  const { threads, selectThread } = useComments();
  const openCount = threads.filter((thread) => !thread.resolved).length;
  const visibleThreads = threads.filter((thread) => thread.resolved === (filter === "resolved"));

  return (
    <>
      <Tabs>
        <Tab type="button" aria-pressed={filter === "open"} onClick={() => onFilterChange("open")}>
          Open ({openCount})
        </Tab>
        <Tab
          type="button"
          aria-pressed={filter === "resolved"}
          onClick={() => onFilterChange("resolved")}
        >
          Resolved ({threads.length - openCount})
        </Tab>
      </Tabs>

      {visibleThreads.length === 0 ? (
        <Empty>
          {filter === "open"
            ? "No open threads. Click anywhere on the canvas to start one."
            : "No resolved threads yet."}
        </Empty>
      ) : (
        <List>
          {visibleThreads.map((thread) => {
            const [first] = thread.messages;
            const replyCount = thread.messages.length - 1;

            return (
              <li key={thread.id}>
                <Item type="button" onClick={() => selectThread(thread.id)}>
                  <Badge data-resolved={thread.resolved || undefined}>
                    {threads.indexOf(thread) + 1}
                  </Badge>
                  <Meta>
                    <strong>{first.author}</strong>
                    {formatTimestamp(first.createdAt)}
                  </Meta>
                  <Excerpt>{first.text}</Excerpt>
                  {replyCount > 0 && (
                    <ReplyCount>
                      {replyCount} {replyCount === 1 ? "reply" : "replies"}
                    </ReplyCount>
                  )}
                </Item>
              </li>
            );
          })}
        </List>
      )}
    </>
  );
}
