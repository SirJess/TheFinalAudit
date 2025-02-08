import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import EscapeRoom1 from "./components/views/EscapeRoom1";
import EscapeRoom2 from "./components/views/EscapeRoom2";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}
        {/* <Route path="/" element={<EscapeRoom1 />} /> */}
        <Route path="/" element={<EscapeRoom2 />} />
      </Routes>
    </Router>
  );
}

export default App;
