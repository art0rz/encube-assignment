import { type CommentMessage, type CommentThread } from "./commentsReducer.ts";

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

function message(
  id: string,
  author: string,
  text: string,
  minutes: number,
  parentId: string | null = null,
): CommentMessage {
  return { id, parentId, author, text, createdAt: minutesAgo(minutes) };
}

// Demo threads anchored to the placeholder items in App.
export const seedThreads: CommentThread[] = [
  {
    id: "seed-teapot",
    x: 470,
    y: 245,
    resolved: false,
    messages: [
      message(
        "seed-teapot-1",
        "Maya Chen",
        "The spout reads a bit short next to the reference drawing. Can we lengthen it?",
        180,
      ),
      message(
        "seed-teapot-2",
        "Jonas Berg",
        "Agreed, I'll stretch it by about 15% and re-export.",
        150,
        "seed-teapot-1",
      ),
      message("seed-teapot-3", "Maya Chen", "Perfect, thanks!", 140, "seed-teapot-2"),
    ],
  },
  {
    id: "seed-torus",
    x: 640,
    y: 180,
    resolved: false,
    messages: [
      message(
        "seed-torus-1",
        "Priya Nair",
        "Could we try a warmer colour here? The blue clashes with the cube.",
        95,
      ),
      message("seed-torus-2", "Sam Okafor", "+1, maybe the orange from the teapot?", 60),
    ],
  },
  {
    id: "seed-icosahedron",
    x: 240,
    y: 480,
    resolved: false,
    messages: [
      message(
        "seed-icosahedron-1",
        "Sam Okafor",
        "Love the faceted look. Should the edges be softened a little to match the cube?",
        35,
      ),
    ],
  },
  {
    id: "seed-horse",
    x: 240,
    y: 690,
    resolved: true,
    messages: [
      message(
        "seed-horse-1",
        "Jonas Berg",
        "The front leg proportions are off in this sketch.",
        1440,
      ),
      message("seed-horse-2", "Maya Chen", "Fixed in the latest upload.", 1380, "seed-horse-1"),
    ],
  },
];
