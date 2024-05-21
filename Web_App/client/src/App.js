import { Route, Routes } from "react-router-dom";
import Navbar from "./component/Navbar";
import Stream from "./pages/Stream";
import Storages from "./pages/Storage";
function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Stream />} />
          <Route path="/storage" element={<Storages />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
