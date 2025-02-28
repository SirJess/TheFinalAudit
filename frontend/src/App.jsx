import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import EscapeRoom1 from "./components/views/EscapeRoom1";
import EscapeRoom2 from "./components/views/EscapeRoom2";
import Title_screen from "./components/views/Title_screen";
import Levels from "./components/Levels";
import AllLevels from "./components/AllLevels";
import Intro1 from "./components/views/Intro1";
import Leaderboard1 from "./components/views/Leaderboard1";
import Leaderboard2 from "./components/views/Leaderboard2";
import Intro2 from "./components/views/Intro2";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Title_screen />} />
        <Route path="/intro1" element={<Intro1 />} />
        <Route path="/intro2" element={<Intro2 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/levels" element={<AllLevels />} />
        <Route path="/escape-room-1" element={<EscapeRoom1 />} />
        <Route path="/escape-room-2" element={<EscapeRoom2 />} />
        <Route path="/leaderboard1" element={<Leaderboard1 />} />
        <Route path="/leaderboard2" element={<Leaderboard2 />} />
      </Routes>
    </Router>
  );
}

export default App;
