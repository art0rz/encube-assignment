# Decisions

## Canvas

Everything on the board lives in one "world" layer with a single CSS transform, `translate(pan) scale(zoom)`, with the origin at the top left. Going from a screen position to a canvas position is always `(screen - pan) / zoom`. Placing a thread, dragging an item and zooming all use that same formula, so there's only one place where the maths can go wrong.

Zooming keeps the point under the cursor fixed: I look up the canvas position under the cursor, apply the new zoom, then adjust the pan so that position ends up under the cursor again. The zoom factor is exponential (`zoom * e^(-delta * 0.002)`), which makes a scroll step feel the same whether you're at 20% or 400%. Wheel events that report lines or pages are converted to pixels first, so mice and trackpads behave the same. Zoom is limited to 10–500%.

A press on empty canvas could be the start of a pan or a click to add a thread. If the pointer moves more than 4px it's a pan, otherwise it's a click. Without that margin, a slightly shaky click would pan the board instead of starting a thread. Windows use the same rule, since dragging inside a 3D model rotates it.

When dragging an item, the pointer movement is divided by the zoom, so the item stays under the cursor at any zoom level. Pressing anywhere on a window brings it to the front, like windows on a desktop.

Only a window's content zooms. Its title bar, border and shadow are scaled back down by `1 / zoom`, so they stay the same size on screen while the window grows or shrinks around its content. When a window gets too narrow for its title, the title is cut off with an ellipsis.

I used plain DOM elements and CSS transforms rather than drawing the board on a canvas. Text stays sharp, forms and focus just work, and it's a lot less code. It won't scale to a board with a huge number of objects, but that's not what this is.

## 3D

Each 3D item gets its own react-three-fiber canvas, set to only redraw when something changes (`frameloop="demand"`), so models that aren't being touched cost nothing. The catch is that browsers limit how many WebGL contexts a page can have (Chrome allows 16). With more 3D items I'd switch to one shared WebGL canvas and drei's `View`.

Because the items are scaled with CSS, a 3D canvas gets blurry when you zoom in. To fix that, its pixel ratio is `devicePixelRatio * zoom`, capped at 4 to keep GPU memory in check.

Changing the pixel ratio resizes the WebGL drawing buffer, and doing that for every canvas on every wheel event made zooming laggy. The pixel ratio now updates 200ms after you stop zooming (lodash's `debounce`). The models look slightly soft for a moment while zooming in, which I think is a fair price: in a quick test, 20 wheel events went from 20 buffer resizes per canvas to 1.

## Threads

Clicking anywhere, on empty canvas or inside a window, drops a dashed placeholder pin and opens the panel, but the thread isn't created until the first comment is posted. My first version created a thread on every click, which left empty threads behind whenever someone clicked by accident.

A pin placed on a window is stored relative to the top-left corner of that window's content, so it moves with the window when you drag it; otherwise a comment about the teapot's spout would stay behind when the teapot moves. A pin on empty canvas is stored in canvas coordinates and stays where it is. Either way, pins are scaled by `1 / zoom` so they stay the same size on screen, and the pointed corner sits exactly on the spot that was clicked. A pin on a window shares that window's stacking level, so it disappears behind any window raised over it; pins on empty canvas stay above every window. Pins are numbered, and the list uses the same numbers.

Threads open in a side panel rather than a popover next to the pin. A popover would have to follow the pin around while panning and zooming, and it would cover the thing being discussed. The panel also has more room for nested replies. The downside is that it can hide pins near the right edge of the screen.

In the UI a pin and its discussion are a "thread", and the messages in it are comments. It's what people tend to call them in design reviews, and it makes the open/resolved filter read better: you resolve a thread, not a single comment.

Replies can be nested as deep as people like. Each level is indented by about 23px, with a thin line under the parent's avatar, so deep threads still fit in the 320px panel.

The resolve button sits in the thread's header, and resolved pins turn grey. The list shows open threads by default since those are the ones that need attention, and it remembers the filter when you open a thread and come back.

The app starts with four example threads from different people, pinned to specific parts of the models, including one nested discussion and one resolved thread. Each author gets their own avatar colour. Without them, the collaborative side wouldn't show until you'd written a few comments yourself.

## State

Threads, the selected thread and the draft pin all live in one `useReducer`, shared through `CommentsContext` and a `useComments()` hook. Having the selection and the draft in the same reducer means posting the first comment can create the thread, select it and remove the draft in one go. The state is small and only used in a few places, so I didn't think a library like Redux or Zustand was worth adding.

Which comment you're replying to or editing only matters inside the open thread, so that state lives in the thread component. Its nested comments read it from a small context instead of having it passed down through every level.

The zoom level has its own `CanvasViewportContext`, because items, 3D canvases and pins all need it.

Item positions and their stacking order live in a separate `CanvasItemsContext`, because pins need to know where their window is. Bringing a window to the front changes its `z-index` rather than moving it in the DOM, so the 3D canvases are never re-attached.

## Styling and tooling

I used Emotion's styled components (the brief allows Tailwind "or similar"). Some colours are hardcoded in a few files; in a real product they'd become shared design tokens.

TypeScript, oxlint and oxfmt run in a Husky pre-commit hook, so commits that don't type-check, aren't formatted or have lint errors are rejected.

A GitHub Actions workflow lints, checks formatting, builds and deploys every push to `main` to GitHub Pages. Vite builds with relative asset paths, so the same build works from the `/encube-assignment/` sub-path.

## Bonus items I didn't do

I focused on the core requirements. From the brief's bonus list, I only added `Esc` to close the panel and a visual state for resolved threads. I didn't attempt animations when navigating to a thread, the `C` shortcut, undo/redo, localStorage, a minimap, bulk actions or tests.

## Time spent

About 6 hours over two days: roughly 4 hours on the first day for the canvas, windows, 3D content and the first version of comments, and about 2 hours on the second for pins, the side panel, threads on windows, the docs and deployment.

## What I did myself and what I used an LLM for

I did these by hand:

- the project scaffolding and plumbing
- the infinite canvas, including panning and zooming
- the windows and how you interact with them
- the overall architecture decisions
- most of the styling
- most of the comment logic

I used an LLM (Claude) for:

- the placeholder content (choosing the horses was mine) and the seeded threads
- code review and cleanup
- turning comments into pins with a side panel, and the thread list with its open/resolved filter and resolve button
- letting threads attach to windows, and bringing windows to the front when clicked
- debouncing the 3D render resolution while zooming
- the GitHub Pages workflow
- first drafts of the README and this document

I decided what to build and how it should behave, and reviewed and adjusted what the LLM produced.
