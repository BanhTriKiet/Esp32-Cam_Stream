import { Route, Routes } from "react-router-dom";
import Navbar from "./component/Navbar";
import Stream from "./pages/Stream";
import Storages from "./pages/Storage";
import Video from "./pages/Video";
function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Stream />} />
          <Route path="/storage" element={<Storages />} />
          <Route path="/video" element={<Video />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
