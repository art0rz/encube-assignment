import "./App.css";
import InfiniteCanvas from "./components/InfiniteCanvas.tsx";
import WebGlContent from "./components/WebGlContent.tsx";

function App() {
  return (
    <InfiniteCanvas>
      <WebGlContent />
    </InfiniteCanvas>
  );
}

export default App;
