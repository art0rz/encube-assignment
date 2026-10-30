import "./App.css";
import InfiniteCanvas from "./components/InfiniteCanvas/InfiniteCanvas.tsx";
import WebGlContent from "./components/WebGlContent.tsx";
import horse from "./assets/horse.png";
import Cube from "./components/WebGlScenes/Cube.tsx";
import Teapot from "./components/WebGlScenes/Teapot.tsx";
import TorusKnot from "./components/WebGlScenes/TorusKnot.tsx";
import Icosahedron from "./components/WebGlScenes/Icosahedron.tsx";
import Horse from "./components/WebGlScenes/Horse.tsx";
import InfiniteCanvasItem from "./components/InfiniteCanvasItem.tsx";
import { type ReactNode, Suspense } from "react";
import CommentPins from "./components/CommentPins.tsx";
import CommentPanel from "./components/CommentPanel.tsx";
import CanvasItemsProvider from "./state/CanvasItemsContext/CanvasItemsProvider.tsx";
import { type CanvasItemLayout } from "./state/CanvasItemsContext/canvasItemsReducer.ts";
import { useComments } from "./state/CommentsContext/CommentsContext.ts";

interface CanvasItemDefinition extends CanvasItemLayout {
  title: string;
  content: ReactNode;
}

const canvasItems: CanvasItemDefinition[] = [
  {
    id: "cube",
    title: "Cube",
    x: 20,
    y: 44,
    width: 320,
    height: 320,
    content: (
      <WebGlContent>
        <Cube />
      </WebGlContent>
    ),
  },
  {
    id: "teapot",
    title: "Teapot",
    x: 240,
    y: 144,
    width: 300,
    height: 200,
    content: (
      <WebGlContent>
        <Teapot />
      </WebGlContent>
    ),
  },
  {
    id: "torus-knot",
    title: "Torus knot",
    x: 520,
    y: 104,
    width: 200,
    height: 300,
    content: (
      <WebGlContent>
        <TorusKnot />
      </WebGlContent>
    ),
  },
  {
    id: "icosahedron",
    title: "Icosahedron",
    x: 70,
    y: 344,
    width: 320,
    height: 320,
    content: (
      <WebGlContent>
        <Icosahedron />
      </WebGlContent>
    ),
  },
  {
    id: "horse-model",
    title: "Horse model",
    x: 480,
    y: 624,
    width: 400,
    height: 300,
    content: (
      <Suspense fallback={<p>Loading...</p>}>
        <WebGlContent>
          <Horse />
        </WebGlContent>
      </Suspense>
    ),
  },
  {
    id: "horse-drawing",
    title: "Horse drawing",
    x: 60,
    y: 624,
    width: 400,
    height: 300,
    content: <img src={horse} alt="" style={{ width: "100%", height: "100%" }} />,
  },
];

function App() {
  const { startDraft } = useComments();

  return (
    <CanvasItemsProvider initialItems={canvasItems}>
      <InfiniteCanvas>
        {canvasItems.map(({ id, title, content }) => (
          <InfiniteCanvasItem
            key={id}
            id={id}
            title={title}
            onContentClick={(point) => startDraft({ itemId: id, ...point })}
          >
            {content}
          </InfiniteCanvasItem>
        ))}

        <CommentPins />
      </InfiniteCanvas>

      <CommentPanel />
    </CanvasItemsProvider>
  );
}

export default App;
