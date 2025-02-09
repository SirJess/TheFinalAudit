import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import EscapeRoom1 from "./components/views/EscapeRoom1";
import EscapeRoom2 from "./components/views/EscapeRoom2";
import Title_screen from "./components/views/Title_screen";
import Levels from "./components/Levels";
import AllLevels from "./components/AllLevels";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}
        {/* <Route path="/" element={<EscapeRoom1 />} /> */}
        {/* <Route path="/" element={<EscapeRoom2 />} /> */}
        <Route path="/" element={<Title_screen />} />
        <Route path="/levels" element={<AllLevels />} />
        <Route path="/escape-room-1" element={<EscapeRoom1 />} />
        <Route path="/escape-room-2" element={<EscapeRoom2 />} />
      </Routes>
    </Router>
  );
}

export default App;
