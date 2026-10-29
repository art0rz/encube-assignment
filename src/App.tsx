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
      <InfiniteCanvasItem title="Cube" x={20} y={20} width={320} height={320}>
        <WebGlContent>
          <Cube />
        </WebGlContent>
      </InfiniteCanvasItem>
      <InfiniteCanvasItem title="Teapot" x={240} y={120} width={300} height={200}>
        <WebGlContent>
          <Teapot />
        </WebGlContent>
      </InfiniteCanvasItem>
      <InfiniteCanvasItem title="Torus knot" x={520} y={80} width={200} height={300}>
        <WebGlContent>
          <TorusKnot />
        </WebGlContent>
      </InfiniteCanvasItem>
      <InfiniteCanvasItem title="Icosahedron" x={70} y={320} width={320} height={320}>
        <WebGlContent>
          <Icosahedron />
        </WebGlContent>
      </InfiniteCanvasItem>
      <InfiniteCanvasItem title="Horse model" x={480} y={600} width={400} height={300}>
        <Suspense fallback={<p>Loading...</p>}>
          <WebGlContent>
            <Horse />
          </WebGlContent>
        </Suspense>
      </InfiniteCanvasItem>
      <InfiniteCanvasItem title="Horse drawing" x={60} y={600} width={400} height={300}>
        <img src={horse} alt="" style={{ width: "100%", height: "100%" }} />
      </InfiniteCanvasItem>
    </InfiniteCanvas>
  );
}

export default App;
