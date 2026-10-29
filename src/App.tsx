import "./App.css";
import InfiniteCanvas from "./components/InfiniteCanvas.tsx";
import WebGlContent from "./components/WebGlContent.tsx";
import horse from "./assets/horse.png";
import Cube from "./components/WebGlScenes/Cube.tsx";
import Teapot from "./components/WebGlScenes/Teapot.tsx";
import TorusKnot from "./components/WebGlScenes/TorusKnot.tsx";
import Icosahedron from "./components/WebGlScenes/Icosahedron.tsx";
import Horse from "./components/WebGlScenes/Horse.tsx";
import InfiniteCanvasItem from "./components/InfiniteCanvasItem.tsx";
import { Suspense } from "react";

function App() {
  return (
    <InfiniteCanvas>
      <InfiniteCanvasItem x={20} y={20}>
        <WebGlContent>
          <Cube />
        </WebGlContent>
      </InfiniteCanvasItem>
      <InfiniteCanvasItem x={20} y={20}>
        <WebGlContent>
          <Teapot />
        </WebGlContent>
      </InfiniteCanvasItem>
      <InfiniteCanvasItem x={20} y={20}>
        <WebGlContent>
          <TorusKnot />
        </WebGlContent>
      </InfiniteCanvasItem>
      <InfiniteCanvasItem x={20} y={20}>
        <WebGlContent>
          <Icosahedron />
        </WebGlContent>
      </InfiniteCanvasItem>
      <InfiniteCanvasItem x={20} y={20}>
        <Suspense fallback={<p>Loading...</p>}>
          <WebGlContent>
            <Horse />
          </WebGlContent>
        </Suspense>
      </InfiniteCanvasItem>

      <InfiniteCanvasItem x={20} y={20}>
        <img src={horse} className="base" width="170" height="179" alt="" />
      </InfiniteCanvasItem>
    </InfiniteCanvas>
  );
}

export default App;
