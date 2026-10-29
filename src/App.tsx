import "./App.css";
import InfiniteCanvas from "./components/InfiniteCanvas.tsx";
import WebGlContent from "./components/WebGlContent.tsx";

import horse from "./assets/horse.png";
import Cube from "./components/WebGlScenes/Cube.tsx";
import Teapot from "./components/WebGlScenes/Teapot.tsx";
import TorusKnot from "./components/WebGlScenes/TorusKnot.tsx";
import Icosahedron from "./components/WebGlScenes/Icosahedron.tsx";
import Horse from "./components/WebGlScenes/Horse.tsx";
import { Suspense } from "react";

function App() {
  return (
    <InfiniteCanvas>
      <WebGlContent>
        <Cube />
      </WebGlContent>
      <WebGlContent>
        <Teapot />
      </WebGlContent>
      <WebGlContent>
        <TorusKnot />
      </WebGlContent>
      <WebGlContent>
        <Icosahedron />
      </WebGlContent>
      <Suspense fallback={<p>Loading...</p>}>
        <WebGlContent>
          <Horse />
        </WebGlContent>
      </Suspense>
      <img src={horse} className="base" width="170" height="179" alt="" />
    </InfiniteCanvas>
  );
}

export default App;
