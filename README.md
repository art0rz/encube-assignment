# Encube canvas review

A lightweight design-review tool: an infinite, pannable and zoomable canvas with 2D and 3D items, where you can pin comment threads anywhere, discuss them in nested replies, and resolve them when done.

Built with React 19, TypeScript, Vite, Emotion and react-three-fiber. Everything runs client-side; there is no backend.

- **Live demo:** https://art0rz.github.io/encube-assignment/
- **Design decisions:** see [DECISIONS.md](DECISIONS.md)

## Getting started

Requires Node.js `^20.19.0` or `>=22.12.0` (Vite 8's minimum) and npm.

```bash
npm install
npm run dev
```

Then open the URL Vite prints, usually http://localhost:5173.

To build and preview a production bundle:

```bash
npm run build
npm run preview
```

### Scripts

| Script              | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Start the Vite dev server with hot reload     |
| `npm run build`     | Type-check the project and build into `dist/` |
| `npm run preview`   | Serve the production build locally            |
| `npm run typecheck` | Type-check the app without emitting files     |
| `npm run lint`      | Lint with oxlint                              |
| `npm run fmt`       | Format with oxfmt                             |
| `npm run fmt:check` | Check formatting without writing changes      |

A Husky pre-commit hook runs the type check, formatter and linter.

## Using the app

### Canvas

- **Pan:** drag an empty part of the canvas.
- **Zoom:** scroll. Zooming is centred on the cursor and ranges from 10% to 500%; the current level is shown in the bottom bar.
- **Move an item:** drag it by its title bar.
- **Rotate a 3D model:** drag inside it.

### Threads

- **Start a thread:** click an empty part of the canvas. A dashed pin marks the spot and the side panel opens; the thread is only created once you post the first comment.
- **Open a thread:** click its numbered pin. Pins stay anchored to their canvas position and keep the same on-screen size at any zoom level.
- **Reply, nest and edit:** use the reply and pencil buttons on any comment. Replies can be nested.
- **Resolve:** use the Resolve button in a thread's header. Resolved pins turn grey; Reopen brings a thread back.
- **Browse all threads:** click **Threads** in the top-right corner to see every thread, filtered by Open or Resolved.
- **Close the panel:** click the close button or press <kbd>Esc</kbd>.

The app starts with a few seeded threads from different authors. New comments are posted as "You". State lives in memory, so reloading the page resets it.

## Project structure

```
src/
├── App.tsx                         # Canvas items, pins and the thread panel
├── components/
│   ├── InfiniteCanvas/             # Pan/zoom surface and its pointer and wheel handling
│   ├── InfiniteCanvasItem.tsx      # Draggable window placed in canvas coordinates
│   ├── WebGlContent.tsx            # react-three-fiber canvas with zoom-aware resolution
│   ├── WebGlScenes/                # The 3D placeholder models
│   ├── CommentPins.tsx             # Thread pins on the canvas
│   ├── CommentPanel.tsx            # Side panel: thread list, thread view or new thread
│   ├── CommentList.tsx             # Thread list with the Open/Resolved filter
│   ├── CommentBox.tsx              # A thread's nested comments
│   └── CommentForm.tsx             # Text input used for new comments, replies and edits
├── state/
│   ├── CanvasViewportContext/      # Current zoom level for items inside the canvas
│   └── CommentsContext/            # Threads reducer, provider, hook and seed data
├── types/                          # Shared types
└── utils/                          # Small helpers such as timestamp formatting
```

## Known limitations

- Threads aren't persisted; a reload restores the seeded threads.
- There is a single local user, so every new comment is by "You".
- The side panel can cover pins near the right edge of the screen.
